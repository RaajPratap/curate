import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    
    // Log to error tracking service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-800 rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h2>
            
            <p className="text-zinc-400 mb-6">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 text-left">
                <details className="text-xs text-zinc-500 bg-zinc-900 rounded p-4 overflow-auto">
                  <summary className="cursor-pointer font-semibold mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {'\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
