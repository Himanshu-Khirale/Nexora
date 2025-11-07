interface StatusBannerProps {
  kind?: 'info' | 'error';
  message: string;
  onRetry?: () => void;
}

export const StatusBanner = ({ kind = 'info', message, onRetry }: StatusBannerProps) => (
  <div className={`status-banner status-banner--${kind}`}>
    <span>{message}</span>
    {onRetry && (
      <button type="button" className="btn btn--ghost" onClick={onRetry}>
        Retry
      </button>
    )}
  </div>
);

