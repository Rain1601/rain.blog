'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Stack, 
  Tooltip,
  IconButton,
  Divider
} from '@mui/material';
import { 
  PlayArrow, 
  Refresh, 
  Clear, 
  ContentCopy, 
  Check 
} from '@mui/icons-material';
import { CodeEditor } from './CodeEditor';
import { OutputDisplay } from './OutputDisplay';
import ErrorBoundary from './ErrorBoundary';
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
        error: '请输入代码',
        success: false,
        executionTime: 0,
      });
      return;
    }

    setIsRunning(true);
    try {
      const execResult = await executeCode(currentCode);
      setResult(execResult);
      
      // 执行后滚动到输出区域
      setTimeout(() => {
        scrollToOutput();
      }, 100);
    } catch (error) {
      setResult({
        output: '',
        error: `执行失败: ${String(error)}`,
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
    <Box ref={containerRef} sx={{ my: 4 }}>
      {/* 标题和描述 */}
      {(title || description) && (
        <Box sx={{ mb: 2 }}>
          {title && (
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: 'text.primary', 
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                bgcolor: 'primary.main', 
                borderRadius: '50%' 
              }} />
              {title}
            </Typography>
          )}
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {description}
            </Typography>
          )}
        </Box>
      )}

      {/* 主容器 */}
      <Paper elevation={2} sx={{ 
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}>
        {/* 控制栏 */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'action.hover',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {/* 左侧：运行按钮和状态 */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                startIcon={isRunning ? null : <PlayArrow />}
                onClick={runCode}
                disabled={isRunning || pyodideStatus !== 'ready'}
                sx={{
                  minWidth: 120,
                  '&.Mui-disabled': {
                    opacity: 0.7
                  }
                }}
              >
                {isRunning ? '运行中...' : '运行代码'}
              </Button>
              
              <Typography variant="caption" color="text.secondary">
                Ctrl+Enter
              </Typography>
              
              {pyodideStatus === 'loading' && (
                <Typography variant="caption" color="warning.main">
                  Python环境加载中...
                </Typography>
              )}
            </Stack>

            {/* 右侧：工具按钮 */}
            <Stack direction="row" spacing={1}>
              <Tooltip title="复制代码">
                <IconButton 
                  size="small" 
                  onClick={copyCode}
                  color={copySuccess ? 'success' : 'default'}
                >
                  {copySuccess ? <Check /> : <ContentCopy />}
                </IconButton>
              </Tooltip>
              
              {enableClear && (
                <Tooltip title="清除输出">
                  <IconButton size="small" onClick={clearOutput}>
                    <Clear />
                  </IconButton>
                </Tooltip>
              )}
              
              {enableReset && (
                <Tooltip title="重置代码">
                  <IconButton size="small" onClick={resetCode}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* 代码编辑器 */}
        <Box sx={{ position: 'relative' }}>
          <CodeEditor
            code={currentCode}
            onChange={setCurrentCode}
            height={height}
            readOnly={readOnly}
            onRun={runCode}
          />
        </Box>

        {/* 输出显示 */}
        <Box ref={outputRef}>
          <OutputDisplay result={result} isRunning={isRunning} />
        </Box>
      </Paper>
    </Box>
  );
}

export function InteractiveCodeBlock(props: InteractiveCodeBlockProps) {
  return (
    <ErrorBoundary>
      <InteractiveCodeBlockInner {...props} />
    </ErrorBoundary>
  );
} 