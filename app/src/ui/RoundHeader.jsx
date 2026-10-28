import { totalRounds } from '../game/rules'
import { useTranslation } from '../i18n'

// Where we are in the game, how many cards are dealt and who deals
export default function RoundHeader({ players, round }) {
  const { t } = useTranslation()
  const total = totalRounds(players.length)

  const stepClass = (i) => {
    if (i < round.index) return 'round__step round__step--done'
    if (i === round.index) return 'round__step round__step--current'
    return 'round__step'
  }

  return (
    <section className="round">
      <h2 className="round__label">{t.roundOf(round.index + 1, total)}</h2>
      <div className="round__progress" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={stepClass(i)} />
        ))}
      </div>
      <div className="round__hero">
        <p className="round__cards">
          <strong>{round.cards}</strong>
          {t.cardsWord(round.cards)}
        </p>
        <div>
          <p className="hint">{t.dealer}</p>
          <p className="round__dealer">{players[round.dealer]}</p>
          <p className="hint">{t.firstBidderIs(players[round.firstBidder])}</p>
        </div>
      </div>
    </section>
  )
}
