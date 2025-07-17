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
  Button,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { CalendarToday, Schedule, ArrowForward, Search, Clear } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';

import { getAllPosts, getAllTags, getPostsByTag, searchAndFilterPosts } from '@/utils/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';


export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const allPosts = getAllPosts();
  const allTags = getAllTags();
  
  // 使用综合搜索和筛选函数
  const displayPosts = searchAndFilterPosts(searchText, selectedTag);
  
  // 计算每个标签的文章数
  const getTagCount = (tag: string) => {
    return getPostsByTag(tag).length;
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchText('');
  };

  // 清除所有筛选
  const clearAllFilters = () => {
    setSelectedTag(null);
    setSearchText('');
  };

  return (
        <Box 
          sx={{ 
            bgcolor: 'background.default',
            minHeight: '100vh',
          }}
        >
          <Container maxWidth="md" sx={{ pb: 0 }}>
            {/* 搜索框 */}
            <Box sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
              <TextField
                fullWidth
                placeholder="搜索文章标题、内容或标签..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchText && (
                    <InputAdornment position="end">
                      <IconButton onClick={clearSearch} size="small">
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            {/* 标签过滤器 */}
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h6" 
                sx={{ mb: 3, color: 'text.primary' }}
              >
                按标签筛选
              </Typography>
              <Stack 
                direction="row" 
                spacing={1} 
                sx={{ 
                  flexWrap: 'wrap', 
                  gap: 1
                }}
              >
                <Chip
                  label={`全部 (${allPosts.length})`}
                  onClick={() => setSelectedTag(null)}
                  color={selectedTag === null ? 'primary' : 'default'}
                  variant={selectedTag === null ? 'filled' : 'outlined'}
                  sx={{ 
                    mb: 1,
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
                {allTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`${tag} (${getTagCount(tag)})`}
                    onClick={() => setSelectedTag(tag)}
                    color={selectedTag === tag ? 'primary' : 'default'}
                    variant={selectedTag === tag ? 'filled' : 'outlined'}
                    sx={{ 
                      mb: 1,
                      '&:hover': {
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* 当前筛选状态 */}
            {(selectedTag || searchText) && (
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary">
                    当前筛选：
                  </Typography>
                  {selectedTag && (
                    <Chip
                      label={`标签: ${selectedTag}`}
                      onDelete={() => setSelectedTag(null)}
                      size="small"
                      color="primary"
                    />
                  )}
                  {searchText && (
                    <Chip
                      label={`搜索: ${searchText}`}
                      onDelete={clearSearch}
                      size="small"
                      color="primary"
                    />
                  )}
                  <Button 
                    size="small" 
                    onClick={clearAllFilters}
                    sx={{ ml: 1 }}
                  >
                    清除所有筛选
                  </Button>
                </Stack>
              </Box>
            )}

            {/* 文章列表 */}
            <Box sx={{ mb: 0 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                找到 {displayPosts.length} 篇文章
              </Typography>

              <Stack spacing={3}>
                {displayPosts.map((post) => (
                  <Link 
                    key={post.slug} 
                    href={`/posts/${post.slug}`} 
                    style={{ textDecoration: 'none' }}
                  >
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
                        <CardContent sx={{ p: 4 }}>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
                              <Typography variant="body2" color="primary.main" fontWeight={600}>
                                {format(new Date(post.date), 'yyyy年M月d日', { locale: zhCN })}
                              </Typography>
                            </Stack>
                            
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {post.readTime || '5分钟'}
                              </Typography>
                            </Stack>
                          </Stack>

                          <Typography 
                            variant="h5" 
                            component="h3" 
                            sx={{ 
                              mb: 2,
                              fontWeight: 600,
                              lineHeight: 1.3,
                              color: 'text.primary',
                            }}
                          >
                            {post.title}
                          </Typography>

                          {post.excerpt && (
                            <Typography 
                              variant="body1" 
                              color="text.secondary" 
                              sx={{ 
                                mb: 3,
                                lineHeight: 1.6,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {post.excerpt}
                            </Typography>
                          )}

                          <Stack 
                            direction="row" 
                            justifyContent="space-between" 
                            alignItems="center"
                          >
                            <Stack direction="row" spacing={1}>
                              {post.tags.slice(0, 3).map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{ 
                                    fontSize: '0.75rem',
                                    height: 24
                                  }}
                                />
                              ))}
                              {post.tags.length > 3 && (
                                <Typography variant="body2" color="text.secondary">
                                  +{post.tags.length - 3}
                                </Typography>
                              )}
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center" color="primary.main">
                              <Typography variant="body2" fontWeight={600}>
                                阅读文章
                              </Typography>
                              <ArrowForward sx={{ fontSize: 16 }} />
                            </Stack>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Link>
                ))}
              </Stack>

              {displayPosts.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    没有找到相关文章
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {searchText ? '尝试其他搜索关键词' : '尝试选择其他标签'}或查看所有文章
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={clearAllFilters}
                    sx={{ mt: 2 }}
                  >
                    清除筛选条件
                  </Button>
                </Box>
              )}
            </Box>
          </Container>
        </Box>
  );
} 