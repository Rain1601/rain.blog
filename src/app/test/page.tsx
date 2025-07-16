'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Stack, 
  Card, 
  CardContent,
  Divider 
} from '@mui/material';

export default function TestPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          样式测试页面
        </Typography>
        
        <Stack spacing={4}>
          {/* 测试居中布局 */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              bgcolor: 'primary.50',
              border: 1,
              borderColor: 'primary.200'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              布局测试
            </Typography>
            <Typography sx={{ color: 'primary.700' }}>
              这个区域应该居中显示，最大宽度为 md (960px)，并且有适当的内边距。
            </Typography>
          </Paper>

          {/* 测试按钮样式 */}
          <Paper elevation={1} sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
              按钮测试
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button variant="contained" color="primary">
                主按钮
              </Button>
              <Button variant="outlined" color="secondary">
                次按钮
              </Button>
              <Button variant="text" color="success">
                文本按钮
              </Button>
              <Button variant="contained" color="error">
                错误按钮
              </Button>
            </Stack>
          </Paper>

          {/* 测试卡片样式 */}
          <Paper elevation={1} sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
              卡片测试
            </Typography>
            <Stack spacing={2}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    卡片标题
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    这是一个测试卡片的内容。Material-UI 的卡片组件提供了很好的视觉层次。
                  </Typography>
                </CardContent>
              </Card>
              
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    另一个卡片
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    这是另一个卡片，展示了多个卡片的排列效果。
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Paper>

          {/* 测试文字样式 */}
          <Paper elevation={1} sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
              文字样式测试
            </Typography>
            <Stack spacing={2}>
              <Typography variant="h4" component="h3">
                这是 H4 标题
              </Typography>
              <Typography variant="h5" component="h4">
                这是 H5 标题
              </Typography>
              <Typography variant="h6" component="h5">
                这是 H6 标题
              </Typography>
              <Divider />
              <Typography variant="body1">
                这是正文文字 (body1)。Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                这是次要正文文字 (body2)。Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                这是说明文字 (caption)。小字体，通常用于标注。
              </Typography>
            </Stack>
          </Paper>

          {/* 测试响应式布局 */}
          <Paper elevation={1} sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
              响应式测试
            </Typography>
            <Typography variant="body1" gutterBottom>
              这个页面应该在不同屏幕尺寸下都有良好的显示效果。
            </Typography>
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(3, 1fr)' 
                },
                gap: 2,
                mt: 2
              }}
            >
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6">项目 1</Typography>
                  <Typography variant="body2" color="text.secondary">
                    响应式网格项目
                  </Typography>
                </CardContent>
              </Card>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6">项目 2</Typography>
                  <Typography variant="body2" color="text.secondary">
                    响应式网格项目
                  </Typography>
                </CardContent>
              </Card>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6">项目 3</Typography>
                  <Typography variant="body2" color="text.secondary">
                    响应式网格项目
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
} 