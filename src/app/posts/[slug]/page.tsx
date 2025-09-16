'use client';

import { notFound } from 'next/navigation';
import { 
  Container,
  Box,
  Typography,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import { CalendarToday, Schedule } from '@mui/icons-material';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MDXProvider } from '@mdx-js/react';
import { getBlogConfig } from '@/utils/posts';
import { mdxComponents } from '@/utils/mdx';
import { useState, useEffect } from 'react';
import TableOfContents from '@/components/TableOfContents';
import type { BlogConfig } from '@/content/blog/config';

// 获取文章内容的函数
async function getPostContent(slug: string) {
  try {
    const postModule = await import(`@/content/blog/posts/${slug}.mdx`);
    return postModule.default;
  } catch (error) {
    console.error('Failed to load post:', error);
    return null;
  }
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [PostContent, setPostContent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<BlogConfig | null>(null);
  
  useEffect(() => {
    // 先解析params
    params.then(({ slug: resolvedSlug }) => {
      const blogConfig = getBlogConfig(resolvedSlug);
      setConfig(blogConfig || null);
      
      if (!blogConfig || !blogConfig.published) {
        notFound();
        return;
      }

      getPostContent(resolvedSlug).then((content) => {
        if (!content) {
          notFound();
          return;
        }
        setPostContent(() => content);
        setLoading(false);
      });
    });
  }, [params]);

  if (!config || !config.published) {
    notFound();
  }

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box 
          sx={{ 
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!PostContent) {
    notFound();
  }

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          minHeight: '100vh',
          py: 4
        }}
      >
        {/* 文章标题和元信息 */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 3,
              color: 'text.primary'
            }}
          >
            {config.title}
          </Typography>
          
          {/* 文章元信息 */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday fontSize="small" />
              <Typography variant="body2">
                {format(new Date(config.date), 'yyyy年M月d日', { locale: zhCN })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Schedule fontSize="small" />
              <Typography variant="body2">
                {config.readTime || '5分钟'}
              </Typography>
            </Box>
          </Stack>

          {/* 标签 */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {config.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* 文章内容 */}
        <Box 
          sx={{ 
            '& .mdx-content': {
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                mt: 4,
                mb: 2,
                fontWeight: 600,
              },
              '& p': {
                mb: 2,
                lineHeight: 1.7,
                color: 'text.primary',
              },
              '& pre': {
                mb: 3,
                borderRadius: 2,
                overflow: 'auto',
              },
              '& code': {
                fontSize: '0.875rem',
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                pl: 2,
                py: 1,
                my: 2,
                bgcolor: 'action.hover',
                fontStyle: 'italic',
              },
              '& ul, & ol': {
                mb: 2,
                pl: 3,
              },
              '& li': {
                mb: 0.5,
              },
              '& a': {
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 2,
                my: 2,
              },
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                mb: 2,
                '& th, & td': {
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 1,
                  textAlign: 'left',
                },
                '& th': {
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                },
              },
            }
          }}
        >
          <MDXProvider components={mdxComponents}>
            <div className="mdx-content">
              <PostContent />
            </div>
          </MDXProvider>
        </Box>
      </Box>
    </Container>
  );
}