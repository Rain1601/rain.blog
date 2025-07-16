'use client';

import React, { Component, ReactNode } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Alert, 
  AlertTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material';
import { Warning, Refresh, ExpandMore, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box sx={{ p: 2 }}>
          <Alert 
            severity="error" 
            icon={<Warning />}
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <AlertTitle sx={{ fontWeight: 600, mb: 2 }}>
              出现错误
            </AlertTitle>
            
            <Typography variant="body2" sx={{ mb: 3, color: 'error.dark' }}>
              很抱歉，此组件遇到了一个错误。请尝试刷新页面或联系支持。
            </Typography>
            
            {this.state.error && (
              <Accordion sx={{ mb: 2, bgcolor: 'error.light', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    错误详情
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>错误:</strong> {this.state.error.message}
                    </Typography>
                    {this.state.error.stack && (
                      <Typography 
                        variant="body2" 
                        component="pre"
                        sx={{ 
                          fontSize: '0.75rem',
                          overflow: 'auto',
                          whiteSpace: 'pre-wrap',
                          bgcolor: 'rgba(0,0,0,0.1)',
                          p: 1,
                          borderRadius: 1
                        }}
                      >
                        {this.state.error.stack}
                      </Typography>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="error"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                size="small"
              >
                刷新页面
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<BugReport />}
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                size="small"
              >
                重试
              </Button>
            </Stack>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

// 用于函数组件的错误边界 Hook 替代方案
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// 简单的错误提示组件
export function ErrorMessage({ 
  message = "加载失败，请重试", 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void; 
}) {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Alert 
        severity="warning" 
        icon={<Warning />}
        sx={{ 
          display: 'inline-flex',
          borderRadius: 2,
          '& .MuiAlert-message': { 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }
        }}
      >
        <Typography variant="body2" sx={{ mb: onRetry ? 2 : 0 }}>
          {message}
        </Typography>
        {onRetry && (
          <Button 
            variant="outlined" 
            size="small" 
            onClick={onRetry}
            startIcon={<Refresh />}
          >
            重试
          </Button>
        )}
      </Alert>
    </Box>
  );
}

export default ErrorBoundary; 