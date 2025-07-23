'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Button
} from '@mui/material';
import { GitHub, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';

export default function HomePage() {

  return (
    <Box 
      sx={{ 
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              mb: 4,
              color: 'text.primary',
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Rain&apos;s Blog
          </Typography>
          
          <Typography 
            variant="h5" 
            component="p" 
            sx={{ 
              mb: 6,
              color: 'text.secondary',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            记录技术思考，分享编程心得，探索无限可能
          </Typography>

          {/* Direct to GitHub Blog Button */}
          <Link href="/github-blog" style={{ textDecoration: 'none' }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<GitHub />}
              endIcon={<ArrowForward />}
              sx={{ 
                py: 2.5,
                px: 6,
                fontSize: '1.2rem',
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 8px 32px 0 rgb(37 99 235 / 30%)',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                '&:hover': {
                  boxShadow: '0 12px 40px 0 rgb(37 99 235 / 40%)',
                  transform: 'translateY(-3px)',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                },
                transition: 'all 0.3s ease',
                minWidth: 280
              }}
            >
              进入博客
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
