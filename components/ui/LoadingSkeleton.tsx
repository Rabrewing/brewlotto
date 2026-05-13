interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export function LoadingSkeleton({ width = '100%', height = '16px', rounded = 'rounded-md', className = '' }: LoadingSkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-white/8 ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
      <LoadingSkeleton width="60%" height="20px" className="mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton key={i} width={`${80 - i * 15}%`} height="14px" className="mb-2" />
      ))}
    </div>
  );
}
