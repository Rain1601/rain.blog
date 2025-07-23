'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Skeleton,
  IconButton,
  Tooltip,
  Stack,
  Button,
  alpha,
  useTheme
} from '@mui/material';
import {
  Search,
  GitHub,
  Refresh,
  TrendingUp,
  LibraryBooks,
  Timeline,
  FilterList
} from '@mui/icons-material';
import { getAllPosts, getStats, BlogPost } from '@/utils/github';
import BlogTimeline from '@/components/BlogTimeline';

export default function GitHubBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [stats, setStats] = useState<{
    totalPosts: number;
    years: string[];
    latestPost?: BlogPost;
  }>({ totalPosts: 0, years: [] });
  const theme = useTheme();

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

  // 搜索和筛选功能
  useEffect(() => {
    let filtered = posts;
    
    // 年份筛选
    if (selectedYear !== 'all') {
      filtered = filtered.filter(post => post.year === selectedYear);
    }
    
    // 搜索过滤
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, selectedYear, posts]);

  // 刷新数据
  const handleRefresh = () => {
    loadData();
  };


  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Skeleton variant="text" width="60%" height={80} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width="40%" height={40} sx={{ mx: 'auto' }} />
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 3 }} />
        </Box>
        
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', gap: 3, mb: 4 }}>
            <Skeleton variant="circular" width={16} height={16} sx={{ mt: 1 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 3 }} />
            </Box>
          </Box>
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 页面头部 */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Timeline fontSize="large" color="primary" />
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}
          >
            博客时间线
          </Typography>
          <Tooltip title="刷新数据">
            <IconButton onClick={handleRefresh} color="primary" size="large">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          记录技术成长的每一个足迹，从 GitHub 仓库实时同步
        </Typography>

        {/* 统计信息 */}
        <Stack direction="row" justifyContent="center" spacing={4} sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            px: 3,
            py: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}>
            <LibraryBooks color="primary" />
            <Typography variant="h6" fontWeight={700}>
              {stats.totalPosts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              篇文章
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            px: 3,
            py: 1.5,
            bgcolor: alpha(theme.palette.secondary.main, 0.1),
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
          }}>
            <TrendingUp color="secondary" />
            <Typography variant="h6" fontWeight={700}>
              {stats.years.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              个年份
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* 搜索和筛选区域 */}
      <Box sx={{ mb: 6 }}>
        {/* 搜索栏 */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索博客文章标题或内容..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }
          }}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            display: 'block',
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
              }
            }
          }}
        />
        
        {/* 年份筛选 */}
        {stats.years.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterList color="action" fontSize="small" />
              <Chip
                label="全部"
                variant={selectedYear === 'all' ? 'filled' : 'outlined'}
                color={selectedYear === 'all' ? 'primary' : 'default'}
                onClick={() => setSelectedYear('all')}
                size="medium"
                sx={{ cursor: 'pointer' }}
              />
              {stats.years.map((year) => (
                <Chip
                  key={year}
                  label={`${year}年`}
                  variant={selectedYear === year ? 'filled' : 'outlined'}
                  color={selectedYear === year ? 'primary' : 'default'}
                  onClick={() => setSelectedYear(year)}
                  size="medium"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Stack>
          </Box>
        )}
        
        {/* 结果统计 */}
        {filteredPosts.length !== posts.length && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            显示 {filteredPosts.length} / {posts.length} 篇文章
          </Typography>
        )}
      </Box>

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {/* 时间线内容 */}
      <BlogTimeline posts={filteredPosts} />

      {/* 底部信息 */}
      <Box sx={{ 
        mt: 8, 
        textAlign: 'center', 
        py: 4, 
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        borderRadius: 3,
        mx: -2
      }}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            博客内容实时同步自
          </Typography>
          <Button
            href="https://github.com/Rain1601/rain.blog.repo"
            target="_blank"
            variant="outlined"
            size="small"
            startIcon={<GitHub />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            GitHub 仓库
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}