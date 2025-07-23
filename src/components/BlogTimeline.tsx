'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Schedule,
  Article,
  GitHub,
  ArrowForward,
  Timeline
} from '@mui/icons-material';
import Link from 'next/link';
import { BlogPost } from '@/utils/github';

interface BlogTimelineProps {
  posts: BlogPost[];
}

interface YearGroupProps {
  year: string;
  posts: BlogPost[];
}

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

const getPreview = (content: string, maxLength: number = 150) => {
  const plainText = content.replace(/[#*`_\[\]()]/g, '').trim();
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...' 
    : plainText;
};

const TimelinePost: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4 }}>
      {/* Timeline dot and line */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 20 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            boxShadow: `0 0 0 6px ${alpha(theme.palette.primary.main, 0.1)}`,
            zIndex: 1,
            animation: index < 3 ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': {
                boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.4)}`,
              },
              '70%': {
                boxShadow: `0 0 0 10px ${alpha(theme.palette.primary.main, 0)}`,
              },
              '100%': {
                boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`,
              },
            },
          }}
        />
        <Box
          sx={{
            width: 2,
            flex: 1,
            minHeight: 60,
            bgcolor: alpha(theme.palette.primary.main, 0.2),
            mt: 1,
          }}
        />
      </Box>

      {/* Content */}
      <Card
        sx={{
          flex: 1,
          borderRadius: 3,
          transition: 'all 0.3s ease',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          '&:hover': {
            transform: 'translateX(8px)',
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
            borderColor: alpha(theme.palette.primary.main, 0.3),
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
            <Article color="primary" sx={{ mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: 'text.primary',
                  mb: 1,
                  '&:hover': {
                    color: 'primary.main',
                  },
                  transition: 'color 0.2s ease',
                }}
              >
                {post.title}
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                  sx={{
                    fontSize: '0.75rem',
                    height: 24,
                  }}
                />
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ my: 2, opacity: 0.3 }} />

          {/* Preview */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
              mb: 3,
              fontSize: '0.95rem',
            }}
          >
            {getPreview(post.content)}
          </Typography>

          {/* Actions */}
          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              href={`/github-blog/${post.id}`}
              variant="contained"
              size="small"
              endIcon={<ArrowForward />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              阅读全文
            </Button>
            <Button
              href={post.url}
              target="_blank"
              size="small"
              startIcon={<GitHub />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              GitHub
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

const YearGroup: React.FC<YearGroupProps> = ({ year, posts }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 6 }}>
      {/* Year Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box
          sx={{
            width: 6,
            height: 40,
            bgcolor: 'primary.main',
            borderRadius: 3,
          }}
        />
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            letterSpacing: '-0.5px',
          }}
        >
          {year}年
        </Typography>
        <Chip
          label={`${posts.length}篇`}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ ml: 1 }}
        />
        <Box
          sx={{
            flex: 1,
            height: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.2),
            ml: 2,
          }}
        />
      </Box>

      {/* Posts */}
      <Box sx={{ ml: 2 }}>
        {posts.map((post, index) => (
          <TimelinePost key={post.id} post={post} index={index} />
        ))}
      </Box>
    </Box>
  );
};

export const BlogTimeline: React.FC<BlogTimelineProps> = ({ posts }) => {
  // Group posts by year
  const postsByYear = posts.reduce((acc, post) => {
    const year = post.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, BlogPost[]>);

  // Sort years descending
  const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  if (posts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Timeline sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          暂无博客文章
        </Typography>
        <Button
          startIcon={<GitHub />}
          href="https://github.com/Rain1601/rain.blog.repo"
          target="_blank"
          variant="outlined"
        >
          查看 GitHub 仓库
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {sortedYears.map((year) => (
        <YearGroup
          key={year}
          year={year}
          posts={postsByYear[year]}
        />
      ))}
    </Box>
  );
};

export default BlogTimeline;