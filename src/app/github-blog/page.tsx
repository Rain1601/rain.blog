'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Skeleton,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search,
  Article,
  Schedule,
  GitHub,
  Refresh,
  TrendingUp,
  LibraryBooks
} from '@mui/icons-material';
import { getAllPosts, getStats, BlogPost } from '@/utils/github';
import Link from 'next/link';

export default function GitHubBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<{
    totalPosts: number;
    years: string[];
    latestPost?: BlogPost;
  }>({ totalPosts: 0, years: [] });

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [postsData, statsData] = await Promise.all([
        getAllPosts(),
        getStats()
      ]);
      
      setPosts(postsData);
      setFilteredPosts(postsData);
      setStats(statsData);
    } catch (err) {
      console.error('加载数据失败:', err);
      setError('无法从GitHub仓库加载博客数据，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadData();
  }, []);

  // 搜索功能
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  // 刷新数据
  const handleRefresh = () => {
    loadData();
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const [year, month] = dateString.split('-');
      const monthNames = [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
      ];
      return `${year}年${monthNames[parseInt(month) - 1]}`;
    } catch {
      return dateString;
    }
  };

  // 截取内容预览
  const getPreview = (content: string, maxLength: number = 200) => {
    const plainText = content.replace(/[#*`_\[\]()]/g, '').trim();
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="60%" height={60} />
          <Skeleton variant="text" width="40%" height={30} />
        </Box>
        
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, md: 6 }} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={40} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 页面头部 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <GitHub fontSize="large" color="primary" />
          <Typography variant="h3" component="h1" fontWeight="bold">
            GitHub 博客仓库
          </Typography>
          <Tooltip title="刷新数据">
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          从 GitHub 仓库动态加载的博客文章
        </Typography>

        {/* 统计信息 */}
        <Grid container justifyContent="center" spacing={3} sx={{ mb: 4 }}>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LibraryBooks color="primary" />
              <Typography variant="h6">
                {stats.totalPosts} 篇文章
              </Typography>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp color="primary" />
              <Typography variant="h6">
                {stats.years.length} 个年份
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* 年份标签 */}
        {stats.years.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {stats.years.map((year) => (
              <Chip
                key={year}
                label={`${year}年`}
                variant="outlined"
                color="primary"
                size="small"
              />
            ))}
          </Box>
        )}
      </Box>

      {/* 搜索栏 */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索博客文章..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            display: 'block',
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            }
          }}
        />
      </Box>

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* 文章列表 */}
      {filteredPosts.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? '没有找到匹配的文章' : '暂无博客文章'}
          </Typography>
          {!searchQuery && (
            <Button
              startIcon={<GitHub />}
              href="https://github.com/Rain1601/rain.blog.repo"
              target="_blank"
              sx={{ mt: 2 }}
            >
              查看 GitHub 仓库
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPosts.map((post) => (
            <Grid size={{ xs: 12, md: 6 }} key={post.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                    <Article color="primary" />
                    <Typography variant="h6" component="h2" fontWeight="bold" sx={{ flexGrow: 1 }}>
                      {post.title}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Schedule fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(post.date)}
                    </Typography>
                    <Chip
                      label={`${post.year}年`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {getPreview(post.content)}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={Link}
                    href={`/github-blog/${post.id}`}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<Article />}
                  >
                    阅读全文
                  </Button>
                  <Button
                    href={post.url}
                    target="_blank"
                    size="small"
                    startIcon={<GitHub />}
                  >
                    GitHub
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 底部信息 */}
      <Box sx={{ mt: 6, textAlign: 'center', py: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          博客内容来源于{' '}
          <Button
            href="https://github.com/Rain1601/rain.blog.repo"
            target="_blank"
            size="small"
            startIcon={<GitHub />}
          >
            GitHub 仓库
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}