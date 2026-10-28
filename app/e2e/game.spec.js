import { expect, test } from '@playwright/test'
import { expectRound, playRound, startGame, step } from './helpers'

const players = ['Άννα', 'Βασίλης', 'Γιώργος']

test('asks for unique names before starting', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Έναρξη' }).click()
  await expect(page.getByText('Κάθε παίκτης χρειάζεται όνομα.')).toBeVisible()

  await page.getByLabel('Παίκτης 1', { exact: true }).fill('Άννα')
  await page.getByLabel('Παίκτης 2', { exact: true }).fill('άννα')
  await page.getByLabel('Παίκτης 3', { exact: true }).fill('Γιώργος')
  await page.getByRole('button', { name: 'Έναρξη' }).click()
  await expect(page.getByText('Τα ονόματα πρέπει να είναι διαφορετικά.')).toBeVisible()
})

test('starts with the chosen first dealer', async ({ page }) => {
  await page.goto('./')
  for (const [i, name] of players.entries()) await page.getByLabel(`Παίκτης ${i + 1}`, { exact: true }).fill(name)
  await page.getByLabel('Πρώτος dealer').selectOption({ label: 'Γιώργος' })
  await page.getByRole('button', { name: 'Έναρξη' }).click()
  await expectRound(page, 'Γύρος 1 από 20', 'Γιώργος')
})

test('scores a round and moves to the next', async ({ page }) => {
  await startGame(page, players)
  await playRound(page, { Άννα: 1 }, { Άννα: 1 })

  await expectRound(page, 'Γύρος 2 από 20', 'Βασίλης')
  const totals = page.locator('.scoreboard__total')
  await expect(totals).toHaveText(['30', '20', '20'])
})

test('tricks must add up to the cards dealt', async ({ page }) => {
  await startGame(page, players)
  await page.getByRole('button', { name: 'Επιβεβαίωση' }).click()

  const finish = page.getByRole('button', { name: 'Τέλος γύρου' })
  await expect(page.getByText('Απομένει 1 μπάζα')).toBeVisible()
  await expect(finish).toBeDisabled()

  await step(page, 'Άννα', 'Μπάζες', 1)
  await expect(finish).toBeEnabled()
})

test('hook rule blocks bids that add up to the cards', async ({ page }) => {
  await startGame(page, players, { hookRule: true })
  await step(page, 'Βασίλης', 'Δήλωση', 1)
  await expect(page.getByText('Κανόνας hook: ο dealer δεν μπορεί να δηλώσει 0.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Επιβεβαίωση' })).toBeDisabled()
})

test('resumes the game after a reload', async ({ page }) => {
  await startGame(page, players)
  await playRound(page, {}, { Βασίλης: 1 })
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Γύρος 2 από 20' })).toBeVisible()
  await expect(page.locator('.scoreboard__total')).toHaveText(['20', '-10', '20'])
})

test('edits a finished round and confirms before discarding', async ({ page }) => {
  await startGame(page, players)
  await playRound(page, {}, { Άννα: 1 })

  await page.getByRole('button', { name: 'Διόρθωση γύρου 1' }).click()
  const dialog = page.getByRole('dialog')
  await step(dialog, 'Άννα', 'Δήλωση', 1)

  // Escape with unsaved edits asks first, dismissing keeps the dialog open
  page.once('dialog', (d) => d.dismiss())
  await page.keyboard.press('Escape')
  await expect(dialog).toBeVisible()

  await dialog.getByRole('button', { name: 'Αποθήκευση' }).click()
  await expect(dialog).toBeHidden()
  await expect(page.locator('.scoreboard__total')).toHaveText(['30', '20', '20'])
})

test('plays a full game to the final ranking and rematch', async ({ page }) => {
  const six = ['A', 'B', 'C', 'D', 'E', 'F']
  await startGame(page, six)
  // Everyone bids 0 and A takes every trick: A misses, the rest score 20 per round
  for (let r = 0; r < 10; r++) await playRound(page, {}, { A: r + 1 })

  await expect(page.getByText('Τέλος παιχνιδιού')).toBeVisible()
  const rows = page.locator('.results__list li')
  await expect(rows.first()).toContainText('200')
  await expect(rows.last()).toContainText('A')
  await expect(rows.last()).toContainText('-550')

  await page.getByRole('button', { name: 'Ρεβάνς' }).click()
  await expectRound(page, 'Γύρος 1 από 10', 'B')
})

test('switches to English and remembers the choice', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByText('Number of players')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')

  await page.reload()
  for (const [i, name] of ['Anna', 'Bill', 'George'].entries()) {
    await page.getByLabel(`Player ${i + 1}`, { exact: true }).fill(name)
  }
  await page.getByRole('button', { name: 'Start' }).click()
  await expectRound(page, 'Round 1 of 20', 'Anna')
})
