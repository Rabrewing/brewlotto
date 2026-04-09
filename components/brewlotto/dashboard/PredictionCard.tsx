import { LotteryBall } from './LotteryBall';

interface PredictionCardProps {
  game: string;
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
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export function PredictionCard({
  game,
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

  return (
    <div className="mb-5 rounded-[30px] border border-white/10 bg-gradient-to-br from-[#18161a]/90 to-[#0f0d12]/90 p-5">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">✨</span>
        <h3 className="text-[16px] font-semibold text-white">Prediction</h3>
      </div>

      {/* Brew says content */}
      <p className="text-[15px] leading-8 text-white/80">
        <span className="font-semibold text-[#ffc742]">Brew says</span> today&apos;s pattern for{' '}
        <span className="font-semibold text-[#ffd364]">{game}</span>{' '}
        {summary}
      </p>

      {state === 'missing_prediction' ? (
        <div className="mt-4 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-[12px] uppercase tracking-[0.14em] text-white/45">
          No stored prediction yet
        </div>
      ) : null}

      {state === 'missing_explanation' && hasPrediction ? (
        <div className="mt-4 rounded-[20px] border border-[#ffc742]/20 bg-[#ffc742]/10 px-4 py-3 text-[12px] uppercase tracking-[0.14em] text-[#ffd873]">
          Stored pick found, explanation pending
        </div>
      ) : null}

      {hasPrediction ? (
        <div className="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
            Latest Generated Pick
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {primaryNumbers.map((number, index) => (
              <LotteryBall
                key={`${number}-${index}`}
                number={number}
                variant="hot"
                size="small"
              />
            ))}
            {bonusNumber !== null && bonusNumber !== undefined ? (
              <LotteryBall
                number={bonusNumber}
                variant="bonus-hot"
                size="small"
                label={bonusLabel}
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {strategyLabel || confidenceScore !== null || generatedAt || sourceGame ? (
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-white/45">
          {strategyLabel ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Strategy: {strategyLabel}
            </span>
          ) : null}
          {confidenceScore !== null && confidenceScore !== undefined ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Confidence: {Math.round(Number(confidenceScore))}
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
