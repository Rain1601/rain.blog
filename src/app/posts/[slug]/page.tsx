import { notFound } from 'next/navigation';
import { 
  Container,
  Box,
  Typography,
  Chip,
  Stack
} from '@mui/material';
import { CalendarToday, Schedule } from '@mui/icons-material';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getBlogConfig } from '@/utils/posts';
import PostContent from '@/components/PostContent';

// 获取文章内容的函数
async function getPostContent(slug: string) {
  try {
    const mdxModule = await import(`@/content/blog/posts/${slug}.mdx`);
    return mdxModule.default;
  } catch {
    return null;
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 获取文章配置
  const config = getBlogConfig(slug);
  
  if (!config || !config.published) {
    notFound();
  }

  // 动态导入MDX内容
  const MDXContent = await getPostContent(slug);

  if (!MDXContent) {
    notFound();
  }

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)
          `,
          py: { xs: 6, md: 10 }
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* 文章头部 */}
          <Box sx={{ 
            p: { xs: 4, md: 6 },
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="body2" color="primary.main" fontWeight={600}>
                    {format(new Date(config.date), 'yyyy年M月d日', { locale: zhCN })}
                  </Typography>
                </Stack>
                
                <Stack direction="row" spacing={1} alignItems="center">
                  <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    阅读时间 {config.readTime}
                  </Typography>
                </Stack>
              </Stack>

              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: 'text.primary',
                  mb: 2
                }}
              >
                {config.title}
              </Typography>

              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.125rem' }
                }}
              >
                {config.excerpt}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {config.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="filled"
                    color="primary"
                    sx={{ 
                      fontWeight: 600,
                      '&:hover': {
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </Box>

          {/* 文章内容 */}
          <Box sx={{ p: { xs: 4, md: 6 } }}>
            <PostContent>
              <MDXContent />
            </PostContent>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}