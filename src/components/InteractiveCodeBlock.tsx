'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Alert,
  CircularProgress,
  Stack,
  IconButton,
  Chip
} from '@mui/material';
import { 
  PlayArrow, 
  Stop, 
  Clear, 
  ContentCopy, 
  Check,
  Code,
  BugReport
} from '@mui/icons-material';
import { CodeEditor } from './CodeEditor';
import { OutputDisplay } from './OutputDisplay';
import ErrorBoundary from './ErrorBoundary';
import { executeCode, isReady, isLoading } from '@/utils/pyodide';

export interface InteractiveCodeBlockProps {
  code: string;
  height?: number;
  readOnly?: boolean;
  showOutput?: boolean;
  title?: string;
  language?: string;
}

const InteractiveCodeBlock: React.FC<InteractiveCodeBlockProps> = ({
  code: initialCode,
  height = 300,
  readOnly = false,
  showOutput = true,
  title,
  language = 'python'
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const executionRef = useRef<boolean>(false);

  // 检查 Pyodide 状态
  useEffect(() => {
    const checkPyodide = () => {
      if (isReady()) {
        setPyodideReady(true);
      } else if (!isLoading()) {
        // 触发初始化
        executeCode('').catch(() => {});
      }
    };

    checkPyodide();
    const interval = setInterval(checkPyodide, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRunCode = async () => {
    if (!pyodideReady || isRunning) return;
    
    setIsRunning(true);
    setError(null);
    setOutput('');
    executionRef.current = true;

    try {
      const result = await executeCode(code);
      if (executionRef.current) {
        setOutput(result.output);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err) {
      if (executionRef.current) {
        const errorMessage = err instanceof Error ? err.message : '代码执行失败';
        setError(errorMessage);
        setOutput(`错误: ${errorMessage}`);
      }
    } finally {
      if (executionRef.current) {
        setIsRunning(false);
      }
    }
  };

  const handleStopExecution = () => {
    executionRef.current = false;
    setIsRunning(false);
  };

  const handleClearOutput = () => {
    setOutput('');
    setError(null);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const hasOutput = output.length > 0 || error;

  return (
    <ErrorBoundary>
      <Paper 
        elevation={2}
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        {/* 标题栏 */}
        {title && (
          <Box sx={{ 
            px: 3, 
            py: 2, 
            bgcolor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Code fontSize="small" color="primary" />
            <Typography variant="subtitle1" fontWeight={600}>
              {title}
            </Typography>
            <Chip 
              label={language.toUpperCase()} 
              size="small" 
              variant="outlined"
              color="primary"
              sx={{ ml: 'auto' }}
            />
          </Box>
        )}

        {/* 代码编辑器 */}
        <Box sx={{ position: 'relative' }}>
          <CodeEditor
            code={code}
            onChange={readOnly ? (() => {}) : setCode}
            height={height}
            readOnly={readOnly}
          />
          
          {/* 操作按钮 */}
          <Box sx={{ 
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            gap: 1,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 2,
            p: 0.5
          }}>
            <IconButton 
              size="small" 
              onClick={handleCopyCode}
              sx={{ color: 'white' }}
              title="复制代码"
            >
              {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
            </IconButton>
          </Box>
        </Box>

        {/* 控制按钮 */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={isRunning ? <CircularProgress size={16} color="inherit" /> : <PlayArrow />}
              onClick={handleRunCode}
              disabled={!pyodideReady || isRunning}
              size="small"
            >
              {!pyodideReady ? '初始化中...' : isRunning ? '运行中...' : '运行代码'}
            </Button>

            {isRunning && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Stop />}
                onClick={handleStopExecution}
                size="small"
              >
                停止
              </Button>
            )}

            {hasOutput && (
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClearOutput}
                size="small"
              >
                清除输出
              </Button>
            )}

            {!pyodideReady && (
              <Typography variant="body2" color="text.secondary">
                正在加载Python环境...
              </Typography>
            )}
          </Stack>
        </Box>

        {/* 输出区域 */}
        {showOutput && (
          <Box>
            {error && (
              <Alert 
                severity="error" 
                icon={<BugReport />}
                sx={{ 
                  borderRadius: 0,
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
                  {error}
                </Typography>
              </Alert>
            )}
            
            {output && (
              <OutputDisplay 
                result={{ 
                  output, 
                  error, 
                  success: !error, 
                  executionTime: 0 
                }} 
                isRunning={isRunning}
              />
            )}
          </Box>
        )}
      </Paper>
    </ErrorBoundary>
  );
};

export { InteractiveCodeBlock };
export default InteractiveCodeBlock; 