import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// React.lazy caches a rejected import, so re-rendering just rethrows it.
// Chunk-load failures (stale deploy, dev re-optimize) need a full reload.
function isChunkLoadError(error: Error | null): boolean {
  return /dynamically imported module|Importing a module script failed|Loading chunk|error loading dynamically/i.test(
    error?.message ?? '',
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message}</p>
            <button
              onClick={() => {
                if (isChunkLoadError(this.state.error)) window.location.reload();
                else this.setState({ hasError: false, error: null });
              }}
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
