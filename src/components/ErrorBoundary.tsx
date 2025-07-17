'use client';

import React, { Component, ReactNode } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Alert,
  Container 
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              textAlign: 'center',
              p: 4,
            }}
          >
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                出错了！
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {this.state.error?.message || '发生了未知错误'}
              </Typography>
            </Alert>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={this.handleRetry}
              sx={{ mt: 2 }}
            >
              重试
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
} 