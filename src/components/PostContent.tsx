'use client';

import { MDXProvider } from '@mdx-js/react';
import { Box } from '@mui/material';
import { mdxComponents } from '@/utils/mdx';

interface PostContentProps {
  children: React.ReactNode;
}

export default function PostContent({ children }: PostContentProps) {
  return (
    <Box sx={{
      '& .prose': {
        maxWidth: 'none',
        color: 'text.primary',
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          color: 'text.primary',
          fontWeight: 700,
          marginTop: 4,
          marginBottom: 2,
          lineHeight: 1.3,
          '&:first-of-type': {
            marginTop: 0,
          },
        },
        '& h1': {
          fontSize: { xs: '2rem', md: '2.5rem' },
          background: 'linear-gradient(135deg, #e2e8f0 0%, #a0aec0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '& h2': {
          fontSize: { xs: '1.5rem', md: '2rem' },
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          paddingBottom: 1,
        },
        '& h3': {
          fontSize: { xs: '1.25rem', md: '1.5rem' },
        },
        '& p': {
          color: 'text.secondary',
          lineHeight: 1.8,
          fontSize: '1.1rem',
          marginBottom: 3,
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'none',
          borderBottom: '1px solid transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            color: 'primary.light',
          },
        },
        '& img': {
          borderRadius: 2,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          width: '100%',
          height: 'auto',
          marginY: 3,
        },
        '& .interactive-code-block': {
          marginY: 4,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.3)',
          mb: 3,
        },
        '& pre': {
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
        },
        '& code': {
          background: 'rgba(0, 0, 0, 0.3)',
          color: '#e2e8f0',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 1,
          padding: '2px 6px',
          fontSize: '0.9em',
        },
        '& blockquote': {
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          background: 'rgba(255, 255, 255, 0.05)',
          margin: 0,
          paddingLeft: 3,
          paddingY: 2,
          marginY: 3,
        },
        '& ul, & ol': {
          paddingLeft: 3,
          '& li': {
            color: 'text.secondary',
            lineHeight: 1.7,
            marginBottom: 1,
          },
        },
      }
    }}>
      <MDXProvider components={mdxComponents}>
        <div className="prose">
          {children}
        </div>
      </MDXProvider>
    </Box>
  );
}