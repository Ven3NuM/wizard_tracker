import { expect } from '@playwright/test'

export async function startGame(page, players, { hookRule = false } = {}) {
  await page.goto('./')
  await page.getByRole('button', { name: String(players.length), exact: true }).click()
  for (const [i, name] of players.entries()) {
    await page.getByLabel(`Παίκτης ${i + 1}`, { exact: true }).fill(name)
  }
  if (hookRule) await page.getByLabel(/Κανόνας hook/).check()
  await page.getByRole('button', { name: 'Έναρξη' }).click()
  await expect(page.getByText('Δηλώσεις')).toBeVisible()
}

// Checks the round header ("Γύρος 2 από 20") and who deals
export async function expectRound(page, label, dealer) {
  await expect(page.getByRole('heading', { name: label })).toBeVisible()
  await expect(page.locator('.round__dealer')).toHaveText(dealer)
}

// Checks each player's total in the standings: { Άννα: 30, … }
export async function expectTotals(page, totals) {
  for (const [name, total] of Object.entries(totals)) {
    const row = page.locator('.standings__row').filter({ hasText: name })
    await expect(row.locator('.standings__total')).toHaveText(String(total))
  }
}

// Presses + on a player's stepper `times` times
export async function step(page, name, column, times) {
  const plus = page.getByRole('button', { name: `${name}, ${column}: αύξηση` })
  for (let i = 0; i < times; i++) await plus.click()
}

// Plays the current round: bids and tricks are { name: value } maps, missing players stay at 0
export async function playRound(page, bids, tricks) {
  for (const [name, value] of Object.entries(bids)) await step(page, name, 'Δήλωση', value)
  await page.getByRole('button', { name: 'Επιβεβαίωση' }).click()
  for (const [name, value] of Object.entries(tricks)) await step(page, name, 'Μπάζες', value)
  await page.getByRole('button', { name: 'Τέλος γύρου' }).click()
}
