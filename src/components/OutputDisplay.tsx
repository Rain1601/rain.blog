'use client';

import { useState, useEffect } from 'react';
import { ExecutionResult } from '@/utils/pyodide';

interface OutputDisplayProps {
  result: ExecutionResult | null;
  isRunning: boolean;
}

export function OutputDisplay({ result, isRunning }: OutputDisplayProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 添加fade-in动画效果
  useEffect(() => {
    if (result || isRunning) {
      setIsVisible(true);
    }
  }, [result, isRunning]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // 可以在这里添加复制成功的视觉反馈
    } catch {
      // 兼容旧版浏览器
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  if (isRunning) {
    return (
      <div className={`border-t border-[var(--border)] bg-[var(--bg-secondary)] transition-all duration-300 ${
        isVisible ? 'opacity-100 animate-fade-in' : 'opacity-0'
      }`}>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--accent)]"></div>
              <div className="w-2 h-2 bg-[var(--warning)] rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm text-[var(--text-secondary)] animate-pulse">
              正在执行代码...
            </span>
          </div>
          
          {/* 执行进度条 */}
          <div className="mt-3 w-full bg-[var(--bg-elevated)] rounded-full h-1.5">
            <div className="bg-[var(--accent)] h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full"></div>
            <span className="text-sm text-[var(--text-muted)]">
              点击运行按钮执行代码
            </span>
          </div>
        </div>
      </div>
    );
  }

  const hasOutput = result.output || result.error;
  const outputLines = hasOutput ? (result.output || result.error || '').split('\n') : [];
  const shouldShowCollapse = outputLines.length > 10;

  return (
    <div className={`border-t border-[var(--border)] bg-[var(--bg-secondary)] transition-all duration-300 ${
      isVisible ? 'opacity-100 animate-fade-in' : 'opacity-0'
    }`}>
      {/* 输出头部 */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        <div className="flex items-center space-x-3">
          {result.success ? (
            <div className="flex items-center space-x-2 animate-slide-up">
              <div className="w-2 h-2 bg-[var(--success)] rounded-full animate-pulse-soft"></div>
              <svg className="w-4 h-4 text-[var(--success)] animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-[var(--success)] font-medium">
                执行成功
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 animate-slide-up">
              <div className="w-2 h-2 bg-[var(--error)] rounded-full animate-pulse-soft"></div>
              <svg className="w-4 h-4 text-[var(--error)] animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm text-[var(--error)] font-medium">
                执行错误
              </span>
            </div>
          )}
          <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-1 rounded">
            {result.executionTime}ms
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {shouldShowCollapse && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded transition-all duration-200 hover:bg-[var(--bg-elevated)]"
            >
              {isCollapsed ? '展开' : '收起'}
            </button>
          )}
          <button
            onClick={() => copyToClipboard(result.output || result.error || '')}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded transition-all duration-200 hover:bg-[var(--bg-elevated)] flex items-center space-x-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>复制</span>
          </button>
        </div>
      </div>

      {/* 输出内容 */}
      <div className="p-4">
        {hasOutput ? (
          <div className="font-mono text-sm animate-slide-up">
            {result.error ? (
              <div className="bg-[var(--error-bg)] border border-[var(--error)]/20 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-[var(--error)] leading-relaxed">
                  {result.error}
                </pre>
              </div>
            ) : (
              <div className="bg-[var(--success-bg)] border border-[var(--success)]/20 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-[var(--text-primary)] leading-relaxed">
                  {isCollapsed ? 
                    outputLines.slice(0, 10).join('\n') + 
                    (outputLines.length > 10 ? '\n...' : '') : 
                    result.output
                  }
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-[var(--text-muted)] animate-fade-in bg-[var(--bg-elevated)] p-4 rounded-lg border border-[var(--border)] flex items-center space-x-2">
            <svg className="w-4 h-4 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>代码执行成功，无输出内容</span>
          </div>
        )}
      </div>
    </div>
  );
} 