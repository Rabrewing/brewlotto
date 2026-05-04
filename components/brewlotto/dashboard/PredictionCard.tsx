import { LotteryBall } from './LotteryBall';

interface PredictionCardProps {
  game: string;
  gameId?: 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega';
  summary: string;
  strategyLabel?: string | null;
  confidenceScore?: number | null;
  generatedAt?: string | null;
  sourceGame?: string | null;
  primaryNumbers?: number[];
  bonusNumber?: number | null;
  bonusLabel?: string;
  state?: 'missing_prediction' | 'missing_explanation' | 'ready';
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

export function PredictionCard({
  game,
  gameId = 'powerball',
  summary,
  strategyLabel,
  confidenceScore,
  generatedAt,
  sourceGame,
  primaryNumbers = [],
  bonusNumber,
  bonusLabel = 'Bonus',
  state = 'ready',
}: PredictionCardProps) {
  const hasPrediction = primaryNumbers.length > 0 || (bonusNumber !== null && bonusNumber !== undefined);
  const ballSize =
    gameId === 'powerball' || gameId === 'mega'
      ? 'tiny'
      : gameId === 'cash5'
        ? 'extraSmall'
        : 'small';
  const centeredPickRow = gameId === 'powerball' || gameId === 'mega';

  return (
    <div className="mb-4 rounded-[24px] border border-[#ffd364]/24 bg-gradient-to-br from-[#18161a]/92 to-[#0f0d12]/92 p-3.5 shadow-[0_0_20px_rgba(255,199,66,0.12),0_0_40px_rgba(255,174,42,0.05),inset_0_0_18px_rgba(255,184,28,0.04)]">
      {/* Header */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-base">✨</span>
        <h3 className="text-[15px] font-semibold text-white">Prediction</h3>
      </div>

      {/* Brew says content */}
      <p className="text-[13px] leading-6 text-white/80">
        <span className="font-semibold text-[#ffc742]">Brew says</span>{' '}
        <span className="font-semibold text-[#ffd364]">{game}</span>{' '}
        {summary}
      </p>

      {state === 'missing_prediction' ? (
        <div className="mt-3 rounded-[18px] border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-white/45">
          No stored prediction yet
        </div>
      ) : null}

      {state === 'missing_explanation' && hasPrediction ? (
        <div className="mt-3 rounded-[18px] border border-[#ffc742]/20 bg-[#ffc742]/10 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[#ffd873]">
          Pick stored, explanation pending
        </div>
      ) : null}

      {hasPrediction ? (
        <div className="mt-3 rounded-[22px] border border-[#ffd364]/16 bg-white/5 p-3">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
            Latest Pick
          </div>
          <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 ${centeredPickRow ? 'justify-center' : ''}`}>
            {primaryNumbers.map((number, index) => (
              <LotteryBall
                key={`${number}-${index}`}
                number={number}
                variant="hot"
                size={ballSize}
              />
            ))}
            {bonusNumber !== null && bonusNumber !== undefined ? (
              <LotteryBall
                number={bonusNumber}
                variant="bonus-hot"
                size={ballSize}
                label={bonusLabel}
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {strategyLabel || confidenceScore !== null || generatedAt || sourceGame ? (
        <div className="mt-3 flex flex-wrap gap-2 text-[9px] uppercase tracking-[0.14em] text-white/45">
          {strategyLabel ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
              {strategyLabel}
            </span>
          ) : null}
          {confidenceScore !== null && confidenceScore !== undefined ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
              {Math.round(Number(confidenceScore))}%
            </span>
          ) : null}
          {sourceGame ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Source: {sourceGame}
            </span>
          ) : null}
          {generatedAt ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Generated: {formatDate(generatedAt)}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
