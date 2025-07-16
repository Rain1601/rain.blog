'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon, Create } from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function Layout({ children, title, description }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setMounted(true);
    
    // 添加normal-scroll类来重置移动端的position:fixed
    if (typeof window !== 'undefined') {
      document.body.classList.add('normal-scroll');
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        document.body.classList.remove('normal-scroll');
      }
    };
  }, []);

  const navigation = [
    { name: '首页', href: '/' },
    { name: '博客', href: '/blog' },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: '#e2e8f0',
      '@media (prefers-color-scheme: light)': {
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        color: '#1e293b'
      }
    }}>
      {/* 导航栏 */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #334155',
          '@media (prefers-color-scheme: light)': {
            background: 'rgba(248, 250, 252, 0.95)',
            borderBottom: '1px solid #e2e8f0'
          }
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateX(2px)'
                }
              }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                    transform: 'scale(1.05)'
                  }
                }}>
                  <Create sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#e2e8f0',
                      transition: 'color 0.3s ease',
                      '@media (prefers-color-scheme: light)': {
                        color: '#1e293b'
                      },
                      '&:hover': {
                        color: '#3b82f6'
                      }
                    }}
                  >
                    Rain's Blog
                  </Typography>
                </Box>
              </Box>
            </Link>

            <Box sx={{ flexGrow: 1 }} />

            {/* 桌面导航链接 */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                  <Button
                    sx={{
                      color: '#cbd5e1',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                      '@media (prefers-color-scheme: light)': {
                        color: '#475569'
                      },
                      '&:hover': {
                        color: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)'
                      }
                    }}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </Box>

            {/* 移动端菜单按钮 */}
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{ 
                display: { xs: 'block', md: 'none' },
                color: '#94a3b8',
                '@media (prefers-color-scheme: light)': {
                  color: '#64748b'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 移动端侧边栏 */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 250,
            background: 'rgba(15, 23, 42, 0.98)',
            backdropFilter: 'blur(12px)',
            border: 'none',
            '@media (prefers-color-scheme: light)': {
              background: 'rgba(248, 250, 252, 0.98)'
            }
          }
        }}
      >
        <List sx={{ pt: 3 }}>
          {navigation.map((item) => (
            <ListItem key={item.name} disablePadding>
              <Link href={item.href} style={{ textDecoration: 'none', width: '100%' }}>
                <ListItemButton
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.1)'
                    }
                  }}
                >
                  <ListItemText 
                    primary={item.name}
                    sx={{
                      '& .MuiTypography-root': {
                        color: '#94a3b8',
                        fontWeight: 500,
                        '@media (prefers-color-scheme: light)': {
                          color: '#64748b'
                        }
                      }
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* 主要内容 */}
      <Box component="main">
        {children}
      </Box>
    </Box>
  );
} 