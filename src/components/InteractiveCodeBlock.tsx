'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [copySuccess, setCopySuccess] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 平滑滚动到输出区域
  const scrollToOutput = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest',
        inline: 'start'
      });
    }
  }, []);

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
    
    // 运行代码时滚动到输出区域
    setTimeout(() => {
      scrollToOutput();
    }, 100);

    try {
      const executionResult = await executeCode(currentCode);
      setResult(executionResult);
      
      // 代码执行完成后再次滚动到输出区域
      setTimeout(() => {
        scrollToOutput();
      }, 100);
    } catch (error) {
      setResult({
        output: '',
        error: `执行错误: ${String(error)}`,
        success: false,
        executionTime: 0,
      });
      
      // 错误时也滚动到输出区域
      setTimeout(() => {
        scrollToOutput();
      }, 100);
    } finally {
      setIsRunning(false);
    }
  }, [currentCode, scrollToOutput]);

  // 复制代码功能
  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
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
    <div ref={containerRef} className="my-8 code-block animate-fade-in">
      {/* 标题和描述 */}
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {/* 主容器 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600 shadow-lg">
        {/* 控制栏 */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
        <div className="flex items-center justify-between">
            {/* 左侧：运行按钮和状态 */}
            <div className="flex items-center space-x-3">
            <button
              onClick={runCode}
              disabled={isRunning || pyodideStatus !== 'ready'}
                aria-label={isRunning ? '代码正在运行中' : '运行Python代码'}
                aria-describedby="run-button-help"
                className={`
                  btn btn-primary flex items-center space-x-2 relative overflow-hidden
                  transition-all duration-200 ease-out
                  ${isRunning || pyodideStatus !== 'ready' 
                    ? 'cursor-not-allowed opacity-75' 
                    : 'hover:scale-105 hover:shadow-button-hover active:scale-95'
                  }
                  ${isRunning ? 'animate-pulse' : ''}
                `}
            >
              {isRunning ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" aria-hidden="true"></div>
                    <span className="animate-pulse">运行中...</span>
                </>
              ) : (
                <>
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                    <span className="transition-all duration-200">运行代码</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 transition-all duration-200 opacity-70 group-hover:opacity-100">
                      Ctrl+Enter
                    </kbd>
                </>
              )}
                
                {/* 成功/失败状态指示器 */}
                {result && (
                  <div 
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      result.success ? 'bg-green-500' : 'bg-red-500'
                    } ${result ? 'opacity-100' : 'opacity-0'}`}
                    aria-live="polite"
                    aria-label={result.success ? '代码执行成功' : '代码执行失败'}
                  >
                    <svg className="w-5 h-5 text-white animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {result.success ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      )}
                    </svg>
                  </div>
              )}
            </button>

              {/* 状态指示器 */}
              <div className="flex items-center space-x-2" role="status" aria-live="polite">
            {pyodideStatus === 'loading' && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 animate-pulse">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" aria-hidden="true"></div>
                <span>正在加载Python环境...</span>
              </div>
            )}

                {pyodideStatus === 'ready' && (
                  <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                    <span>Python 3.11</span>
              </div>
            )}

            {pyodideStatus === 'error' && (
                  <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
                    <div className="w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></div>
                    <span>环境加载失败</span>
              </div>
            )}
              </div>
          </div>

            {/* 右侧：工具按钮 */}
            <div className="flex items-center space-x-2" role="toolbar" aria-label="代码块工具">
            <button
              onClick={clearOutput}
              disabled={!result}
                aria-label="清空输出结果"
                className={`
                  btn btn-secondary text-sm flex items-center space-x-1 
                  transition-all duration-200 ease-out
                  ${!result 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105 hover:shadow-soft active:scale-95'
                  }
                `}
                title="清空输出"
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>清空输出</span>
            </button>

            {enableClear && (
              <button
                onClick={clearEnvironment}
                disabled={pyodideStatus !== 'ready'}
                  aria-label="清空Python环境"
                  className={`
                    btn btn-secondary text-sm flex items-center space-x-1 
                    transition-all duration-200 ease-out
                    ${pyodideStatus !== 'ready' 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-105 hover:shadow-soft active:scale-95'
                    }
                  `}
                  title="清空Python环境"
                >
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>清空环境</span>
              </button>
            )}

            {enableReset && (
              <button
                onClick={resetCode}
                disabled={currentCode === code}
                  aria-label="重置代码到初始状态"
                  className={`
                    btn btn-secondary text-sm flex items-center space-x-1 
                    transition-all duration-200 ease-out
                    ${currentCode === code 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-105 hover:shadow-soft active:scale-95'
                    }
                  `}
                  title="重置代码"
                >
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  <span>重置</span>
                </button>
              )}

              {/* 复制按钮 */}
              <button
                onClick={copyCode}
                aria-label={copySuccess ? '代码已复制' : '复制代码到剪贴板'}
                className={`
                  btn btn-secondary text-sm flex items-center space-x-1 
                  transition-all duration-200 ease-out
                  ${copySuccess 
                    ? 'bg-green-500 hover:bg-green-600 active:bg-green-700' 
                    : 'hover:scale-105 hover:shadow-soft active:scale-95'
                  }
                `}
                title="复制代码"
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{copySuccess ? '已复制' : '复制'}</span>
                {copySuccess && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
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
            onRun={runCode}
        />
      </div>

      {/* 输出显示 */}
        <div ref={outputRef}>
      <OutputDisplay result={result} isRunning={isRunning} />
        </div>
      </div>

      {/* 帮助提示 */}
      <div id="run-button-help" className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>💡 提示：使用 Ctrl+Enter 快速运行代码</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Powered by</span>
          <a 
            href="https://pyodide.org/" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="访问Pyodide官方网站（在新窗口中打开）"
          >
            Pyodide
          </a>
        </div>
      </div>
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