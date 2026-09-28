export const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center p-10" role="status" aria-label="Loading">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
);
