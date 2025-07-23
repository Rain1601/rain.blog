'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  GitHub,
  Schedule,
  Article,
  ContentCopy,
  Check
} from '@mui/icons-material';
import { getPostById, BlogPost } from '@/utils/github';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function GitHubBlogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 加载文章数据
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const postData = await getPostById(id);
        
        if (!postData) {
          setError('文章不存在');
        } else {
          setPost(postData);
        }
      } catch (err) {
        console.error('加载文章失败:', err);
        setError('无法加载文章内容，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id]);

  // 复制链接
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
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


  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || '文章不存在'}
        </Alert>
        <Button
          component={Link}
          href="/github-blog"
          startIcon={<ArrowBack />}
          variant="contained"
        >
          返回博客列表
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 导航栏 */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/github-blog"
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          返回博客列表
        </Button>
      </Box>

      {/* 文章头部 */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
          <Article color="primary" sx={{ mt: 0.5 }} />
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ flexGrow: 1 }}>
            {post.title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(post.date)}
            </Typography>
          </Box>
          <Chip
            label={`${post.year}年`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Tooltip title="复制链接">
              <IconButton onClick={handleCopyLink} size="small">
                {copied ? <Check color="success" /> : <ContentCopy />}
              </IconButton>
            </Tooltip>
            <Tooltip title="在GitHub中查看">
              <IconButton
                href={post.url}
                target="_blank"
                size="small"
              >
                <GitHub />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            文件大小: {Math.round(post.size / 1024)} KB
          </Typography>
          <Typography variant="body2" color="text.secondary">
            路径: {post.path}
          </Typography>
        </Box>
      </Paper>

      {/* 文章内容 */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
        <MarkdownRenderer content={post.content} />
      </Paper>

      {/* 底部操作 */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          component={Link}
          href="/github-blog"
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          返回博客列表
        </Button>
        
        <Button
          href={post.url}
          target="_blank"
          startIcon={<GitHub />}
          variant="contained"
        >
          在GitHub中编辑
        </Button>
      </Box>

      {/* 底部信息 */}
      <Box sx={{ mt: 6, textAlign: 'center', py: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          本文来源于{' '}
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