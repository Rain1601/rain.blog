'use client';

import { useState, useEffect, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { OutputDisplay } from './OutputDisplay';
import { CodeBlockErrorBoundary } from './ErrorBoundary';
import { executeCode, clearNamespace, isReady, isLoading, ExecutionResult } from '@/utils/pyodide';

interface InteractiveCodeBlockProps {
  code?: string;
  height?: number;
  theme?: 'light' | 'dark';
  showLineNumbers?: boolean;
  readOnly?: boolean;
  enableClear?: boolean;
  enableReset?: boolean;
  title?: string;
  description?: string;
}

function InteractiveCodeBlockInner({
  code = '',
  height = 300,
  readOnly = false,
  enableClear = true,
  enableReset = true,
  title,
  description,
}: InteractiveCodeBlockProps) {
  const [currentCode, setCurrentCode] = useState(code);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const runCode = useCallback(async () => {
    if (!currentCode.trim()) {
      setResult({
        output: '',
        error: '代码为空，请输入要执行的Python代码',
        success: false,
        executionTime: 0,
      });
      return;
    }

    setIsRunning(true);
    setResult(null);

    try {
      const executionResult = await executeCode(currentCode);
      setResult(executionResult);
    } catch (error) {
      setResult({
        output: '',
        error: `执行错误: ${String(error)}`,
        success: false,
        executionTime: 0,
      });
    } finally {
      setIsRunning(false);
    }
  }, [currentCode]);

  // 初始化Pyodide状态检查
  useEffect(() => {
    const checkPyodideStatus = () => {
      if (isReady()) {
        setPyodideStatus('ready');
      } else if (isLoading()) {
        setPyodideStatus('loading');
      } else {
        // 触发Pyodide加载
        executeCode('').then(() => {
          setPyodideStatus('ready');
        }).catch(() => {
          setPyodideStatus('error');
        });
      }
    };

    checkPyodideStatus();
    const interval = setInterval(checkPyodideStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // 监听全局运行事件（Ctrl+Enter）
  useEffect(() => {
    const handleRunCode = (event: CustomEvent) => {
      if (event.detail.code === currentCode) {
        runCode();
      }
    };

    window.addEventListener('runCode', handleRunCode as EventListener);
    return () => window.removeEventListener('runCode', handleRunCode as EventListener);
  }, [currentCode, runCode]);

  const clearOutput = () => {
    setResult(null);
  };

  const resetCode = () => {
    setCurrentCode(code);
    setResult(null);
  };

  const clearEnvironment = async () => {
    try {
      await clearNamespace();
      setResult({
        output: '环境已清理',
        error: null,
        success: true,
        executionTime: 0,
      });
    } catch (error) {
      setResult({
        output: '',
        error: `清理环境失败: ${String(error)}`,
        success: false,
        executionTime: 0,
      });
    }
  };

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* 标题和描述 */}
      {(title || description) && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* 控制按钮 */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={runCode}
              disabled={isRunning || pyodideStatus !== 'ready'}
              className={`btn-primary flex items-center space-x-2 ${
                isRunning || pyodideStatus !== 'ready' 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>运行中...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                  <span>运行代码</span>
                </>
              )}
            </button>

            {pyodideStatus === 'loading' && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>正在加载Python环境...</span>
              </div>
            )}

            {pyodideStatus === 'error' && (
              <div className="text-sm text-red-600 dark:text-red-400">
                Python环境加载失败
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={clearOutput}
              disabled={!result}
              className={`btn-secondary text-sm ${
                !result ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              清空输出
            </button>

            {enableClear && (
              <button
                onClick={clearEnvironment}
                disabled={pyodideStatus !== 'ready'}
                className={`btn-secondary text-sm ${
                  pyodideStatus !== 'ready' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                清空环境
              </button>
            )}

            {enableReset && (
              <button
                onClick={resetCode}
                disabled={currentCode === code}
                className={`btn-secondary text-sm ${
                  currentCode === code ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                重置代码
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 代码编辑器 */}
      <div className="relative">
        <CodeEditor
          code={currentCode}
          onChange={setCurrentCode}
          height={height}
          readOnly={readOnly}
        />
      </div>

      {/* 输出显示 */}
      <OutputDisplay result={result} isRunning={isRunning} />
    </div>
  );
}

export function InteractiveCodeBlock(props: InteractiveCodeBlockProps) {
  return (
    <CodeBlockErrorBoundary>
      <InteractiveCodeBlockInner {...props} />
    </CodeBlockErrorBoundary>
  );
} 