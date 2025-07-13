'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 m-4">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">
              出现错误
            </h2>
          </div>
          
          <div className="space-y-3">
            <p className="text-red-700 dark:text-red-300">
              很抱歉，此组件遇到了一个错误。请尝试刷新页面或联系支持。
            </p>
            
            {this.state.error && (
              <details className="bg-red-100 dark:bg-red-800/30 p-3 rounded">
                <summary className="cursor-pointer text-red-800 dark:text-red-200 font-medium">
                  错误详情
                </summary>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300 font-mono">
                  <p><strong>错误:</strong> {this.state.error.message}</p>
                  {this.state.error.stack && (
                    <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                刷新页面
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                重试
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 简化的错误边界组件用于包装单个组件
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: T) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// 代码块专用错误边界
export function CodeBlockErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
              代码块加载失败
            </h3>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            交互式代码块无法正常加载。这可能是由于网络问题或浏览器兼容性问题引起的。
          </p>
          <div className="mt-3 text-sm text-yellow-600 dark:text-yellow-400">
            <p>建议解决方案：</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>刷新页面重试</li>
              <li>检查网络连接</li>
              <li>使用支持WebAssembly的现代浏览器</li>
              <li>确保浏览器支持SharedArrayBuffer</li>
            </ul>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
} 