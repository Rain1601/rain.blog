'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea,
  Chip,
  Stack,
  Button
} from '@mui/material';
import { ArrowForward, Schedule, CalendarToday, GitHub } from '@mui/icons-material';
import Link from 'next/link';

import { getLatestPosts } from '@/utils/posts';
import { Post } from '@/types/post';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
export default function HomePage() {
  const posts: Post[] = getLatestPosts(3);
  const featuredPost: Post | undefined = posts[0];
  const recentPosts: Post[] = posts.slice(1, 3);

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
                  mb: 6,
                  color: 'text.primary',
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                Rain&apos;s Blog
              </Typography>
            </Box>

            {/* Featured Article */}
            {featuredPost && (
              <Box sx={{ mb: 8 }}>
                <Link href={`/posts/${featuredPost.slug}`} style={{ textDecoration: 'none' }}>
                  <Card 
                    sx={{ 
                      borderRadius: 3,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <CardActionArea>
                      <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                          <Chip 
                            label="特色文章" 
                            color="primary" 
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(featuredPost.date), 'yyyy年M月d日', { locale: zhCN })}
                            </Typography>
                          </Stack>
                        </Stack>
                        
                        <Typography 
                          variant="h3" 
                          component="h2" 
                          sx={{ 
                            mb: 3,
                            fontWeight: 600,
                            lineHeight: 1.2,
                            color: 'text.primary',
                            fontSize: { xs: '1.5rem', md: '1.75rem' }
                          }}
                        >
                          {featuredPost.title}
                        </Typography>
                        
                        {featuredPost.excerpt && (
                          <Typography 
                            variant="body1" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 4,
                              lineHeight: 1.7,
                              fontSize: '1.1rem'
                            }}
                          >
                            {featuredPost.excerpt}
                          </Typography>
                        )}
                        
                        <Stack 
                          direction="row" 
                          justifyContent="space-between" 
                          alignItems="center"
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              阅读时间 {featuredPost.readTime || '5分钟'}
                            </Typography>
                          </Stack>
                          
                          <Stack direction="row" spacing={1} alignItems="center" color="primary.main">
                            <Typography variant="body1" fontWeight={600}>
                              阅读全文
                            </Typography>
                            <ArrowForward />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </Box>
            )}

            {/* Recent Articles */}
            <Box sx={{ mb: 8 }}>              
                             <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 4
                }}
              >
                {recentPosts.map((post) => (
                  <Box key={post.slug}>
                    <Link href={`/posts/${post.slug}`} style={{ textDecoration: 'none' }}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          borderRadius: 3,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        <CardActionArea sx={{ height: '100%' }}>
                          <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                              <CalendarToday sx={{ fontSize: 14, color: 'primary.main' }} />
                              <Typography variant="body2" color="primary.main" fontWeight={600}>
                                {format(new Date(post.date), 'yyyy年M月d日', { locale: zhCN })}
                              </Typography>
                            </Stack>
                            
                            <Typography 
                              variant="h6" 
                              component="h3" 
                              sx={{ 
                                mb: 2,
                                fontWeight: 600,
                                lineHeight: 1.3,
                                flexGrow: 0,
                                color: 'text.primary',
                              }}
                            >
                              {post.title}
                            </Typography>
                            
                            {post.excerpt && (
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                  mb: 3,
                                  lineHeight: 1.6,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  flexGrow: 1
                                }}
                              >
                                {post.excerpt}
                              </Typography>
                            )}
                            
                            <Stack 
                              direction="row" 
                              justifyContent="space-between" 
                              alignItems="center"
                              sx={{ mt: 'auto' }}
                            >
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {post.readTime || '5分钟'}
                                </Typography>
                              </Stack>
                              
                              <Stack direction="row" spacing={1} alignItems="center" color="primary.main">
                                <Typography variant="body2" fontWeight={600}>
                                  阅读
                                </Typography>
                                <ArrowForward sx={{ fontSize: 16 }} />
                              </Stack>
                            </Stack>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ textAlign: 'center', pb: 8 }}>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                justifyContent="center"
                alignItems="center"
              >
                <Link href="/blog" style={{ textDecoration: 'none' }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{ 
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 14px 0 rgb(37 99 235 / 25%)',
                      '&:hover': {
                        boxShadow: '0 8px 25px 0 rgb(37 99 235 / 35%)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                      minWidth: 200
                    }}
                  >
                    查看所有文章
                  </Button>
                </Link>
                
                <Link href="/github-blog" style={{ textDecoration: 'none' }}>
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<GitHub />}
                    endIcon={<ArrowForward />}
                    sx={{ 
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 14px 0 rgb(37 99 235 / 15%)',
                      },
                      transition: 'all 0.3s ease',
                      minWidth: 200
                    }}
                  >
                    GitHub 博客
                  </Button>
                </Link>
              </Stack>
            </Box>
          </Container>
        </Box>
  );
}
