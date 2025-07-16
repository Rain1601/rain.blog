import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Chip, 
  Stack, 
  Button,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import { ArrowBack, CalendarToday, Schedule, Person } from '@mui/icons-material';
import { InteractiveCodeBlock } from '@/components/InteractiveCodeBlock';
import { getPostBySlug, getAllPosts } from '@/utils/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 动态导入 MDX 组件
async function getMDXComponent(slug: string) {
  try {
    // 尝试从不同位置导入 MDX 文件
    const mdxComponent = await import(`@/app/posts/${slug}.mdx`);
    return mdxComponent.default;
  } catch (error) {
    try {
      // 备用位置
      const mdxComponent = await import(`@/content/blog/posts/${slug}.mdx`);
      return mdxComponent.default;
    } catch (error2) {
      console.error('无法加载 MDX 文件:', error2);
      return null;
    }
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // 获取 MDX 组件
  const MDXContent = await getMDXComponent(slug);

  return (
    <Box sx={{ 
      bgcolor: 'background.default', 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 30%, rgba(30, 41, 59, 0.8) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(51, 65, 85, 0.6) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(15, 23, 42, 0.9) 0%, transparent 50%),
        linear-gradient(135deg, 
          #0f172a 0%, 
          #1e293b 25%,
          #334155 50%,
          #1e293b 75%,
          #0f172a 100%
        )
      `,
      '@media (prefers-color-scheme: dark)': {
        background: `
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 90%, rgba(30, 41, 59, 0.8) 0%, transparent 60%),
          linear-gradient(135deg, 
            #000000 0%, 
            #0f172a 20%,
            #1e293b 40%,
            #334155 60%,
            #1e293b 80%,
            #000000 100%
          )
        `
      },
      '@media (prefers-color-scheme: light)': {
        background: `
          radial-gradient(circle at 20% 30%, rgba(148, 163, 184, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(203, 213, 225, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(241, 245, 249, 0.5) 0%, transparent 50%),
          linear-gradient(135deg, 
            #f8fafc 0%, 
            #e2e8f0 25%,
            #cbd5e1 50%,
            #e2e8f0 75%,
            #f8fafc 100%
          )
        `
      }
    }}>
      <Container maxWidth="md">
        {/* 返回按钮 */}
        <Box sx={{ pt: 6, pb: 3 }}>
          <Link href="/blog" style={{ textDecoration: 'none' }}>
            <Button
              startIcon={<ArrowBack />}
              sx={{
                color: 'text.secondary',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50px',
                px: 3,
                py: 1.5,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  transform: 'translateX(-4px) translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '@media (prefers-color-scheme: dark)': {
                  bgcolor: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                }
              }}
            >
              返回博客
            </Button>
          </Link>
        </Box>

        {/* 文章头部 */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            mb: 6, 
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.1),
              0 1px 3px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.6)
            `,
            position: 'relative',
            overflow: 'hidden',
            '@media (prefers-color-scheme: dark)': {
              bgcolor: 'rgba(30, 41, 59, 0.9)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.3),
                0 1px 3px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(148, 163, 184, 0.1)
              `,
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #22c55e)',
            }
          }}
        >
          {/* 标题 */}
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              mb: 4,
              fontWeight: 800,
              color: 'text.primary',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              background: 'linear-gradient(135deg, #1e293b, #3b82f6, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              '@media (prefers-color-scheme: dark)': {
                background: 'linear-gradient(135deg, #f1f5f9, #60a5fa, #a78bfa)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }
            }}
          >
            {post.title}
          </Typography>

          {/* 文章元信息 */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ mb: 4 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <Person fontSize="small" />
              </Avatar>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Rain
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <Schedule fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                阅读时间 {post.readTime}分钟
              </Typography>
            </Stack>
          </Stack>

          {/* 标签 */}
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="medium"
                sx={{
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  color: 'primary.main',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </Stack>

          {/* 摘要 */}
          {post.excerpt && (
            <>
              <Divider sx={{ my: 4, opacity: 0.3 }} />
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  fontSize: '1.1rem',
                  fontWeight: 400
                }}
              >
                {post.excerpt}
              </Typography>
            </>
          )}
        </Paper>

        {/* 文章内容 */}
        <Paper 
          elevation={0}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            '@media (prefers-color-scheme: dark)': {
              bgcolor: 'rgba(30, 41, 59, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            }
          }}
        >
          <Box sx={{ 
            p: { xs: 3, md: 6 },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: 'text.primary',
              fontWeight: 700,
              mb: 3,
              mt: 4,
              lineHeight: 1.3,
              '&:first-of-type': { mt: 0 }
            },
            '& h1': { fontSize: '2.5rem' },
            '& h2': { 
              fontSize: '2rem',
              borderBottom: '3px solid',
              borderImage: 'linear-gradient(90deg, #3b82f6, #8b5cf6) 1',
              pb: 2,
              mb: 4
            },
            '& h3': { fontSize: '1.5rem', color: 'primary.main' },
            '& h4': { fontSize: '1.25rem' },
            '& p': {
              color: 'text.primary',
              lineHeight: 1.8,
              mb: 3,
              fontSize: '1rem'
            },
            '& ul, & ol': {
              color: 'text.primary',
              mb: 3,
              pl: 3
            },
            '& li': {
              mb: 1,
              lineHeight: 1.6
            },
            '& code': {
              bgcolor: 'rgba(59, 130, 246, 0.1)',
              color: 'primary.main',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.9em',
              fontFamily: 'JetBrains Mono, monospace'
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              bgcolor: 'rgba(59, 130, 246, 0.05)',
              p: 3,
              m: 0,
              mb: 3,
              borderRadius: '0 8px 8px 0',
              fontStyle: 'italic'
            }
          }}>
            {/* 渲染 MDX 内容 */}
            {MDXContent ? (
              <MDXContent />
            ) : (
              <Typography color="error">
                无法加载文章内容。请检查文件是否存在：{slug}.mdx
              </Typography>
            )}
          </Box>
        </Paper>

        {/* 页面底部间距 */}
        <Box sx={{ pb: 8 }} />
      </Container>
    </Box>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}