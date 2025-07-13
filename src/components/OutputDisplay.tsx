'use client';

import { useState } from 'react';
import { ExecutionResult } from '@/utils/pyodide';

interface OutputDisplayProps {
  result: ExecutionResult | null;
  isRunning: boolean;
}

export function OutputDisplay({ result, isRunning }: OutputDisplayProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
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
      <div className="code-output border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">正在执行代码...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="code-output border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          点击运行按钮执行代码
        </div>
      </div>
    );
  }

  const hasOutput = result.output || result.error;
  const outputLines = hasOutput ? (result.output || result.error || '').split('\n') : [];
  const shouldShowCollapse = outputLines.length > 10;

  return (
    <div className="code-output border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      {/* 输出头部 */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {result.success ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                执行成功
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                执行错误
              </span>
            </div>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({result.executionTime}ms)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {shouldShowCollapse && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded"
            >
              {isCollapsed ? '展开' : '收起'}
            </button>
          )}
          <button
            onClick={() => copyToClipboard(result.output || result.error || '')}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded"
          >
            复制
          </button>
        </div>
      </div>

      {/* 输出内容 */}
      <div className="p-4">
        {hasOutput ? (
          <div className="font-mono text-sm">
            {result.error ? (
              <pre className="error-output whitespace-pre-wrap text-red-600 dark:text-red-400">
                {result.error}
              </pre>
            ) : (
              <pre className="success-output whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {isCollapsed ? 
                  outputLines.slice(0, 10).join('\n') + 
                  (outputLines.length > 10 ? '\n...' : '') : 
                  result.output
                }
              </pre>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            代码执行成功，无输出内容
          </div>
        )}
      </div>
    </div>
  );
} 