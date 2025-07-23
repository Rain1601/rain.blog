'use client';

import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  Code as CodeIcon,
  FormatQuote
} from '@mui/icons-material';

interface MarkdownRendererProps {
  content: string;
}

interface ParsedElement {
  type: string;
  content: string;
  level?: number;
  language?: string;
  items?: string[];
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  
  // 解析Markdown内容
  const parseMarkdown = (markdown: string): ParsedElement[] => {
    const lines = markdown.split('\n');
    const elements: ParsedElement[] = [];
    let currentCodeBlock: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let currentList: string[] = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 代码块处理
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // 开始代码块
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
          currentCodeBlock = [];
        } else {
          // 结束代码块
          inCodeBlock = false;
          elements.push({
            type: 'code',
            content: currentCodeBlock.join('\n'),
            language: codeLanguage
          });
          currentCodeBlock = [];
          codeLanguage = '';
        }
        continue;
      }

      // 在代码块内
      if (inCodeBlock) {
        currentCodeBlock.push(line);
        continue;
      }

      // 列表处理
      if (line.match(/^[-*+]\s+/)) {
        if (!inList) {
          inList = true;
          currentList = [];
        }
        currentList.push(line.replace(/^[-*+]\s+/, ''));
        continue;
      } else if (inList && line.trim() === '') {
        // 继续列表（空行）
        continue;
      } else if (inList) {
        // 结束列表
        inList = false;
        elements.push({
          type: 'list',
          content: '',
          items: [...currentList]
        });
        currentList = [];
      }

      // 标题处理
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 1;
        elements.push({
          type: 'heading',
          content: line.replace(/^#+\s*/, ''),
          level: level
        });
        continue;
      }

      // 引用处理
      if (line.startsWith('>')) {
        elements.push({
          type: 'quote',
          content: line.replace(/^>\s*/, '')
        });
        continue;
      }

      // 分割线
      if (line.match(/^[-_*]{3,}$/)) {
        elements.push({
          type: 'divider',
          content: ''
        });
        continue;
      }

      // 空行
      if (line.trim() === '') {
        if (elements.length > 0 && elements[elements.length - 1].type !== 'break') {
          elements.push({
            type: 'break',
            content: ''
          });
        }
        continue;
      }

      // 普通段落
      elements.push({
        type: 'paragraph',
        content: line
      });
    }

    // 处理未结束的列表
    if (inList && currentList.length > 0) {
      elements.push({
        type: 'list',
        content: '',
        items: currentList
      });
    }

    return elements;
  };

  // 处理内联样式
  const processInlineStyles = (text: string) => {
    return text
      // 粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 内联代码
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  // 渲染代码块
  const renderCodeBlock = (content: string, language?: string) => (
    <Paper
      elevation={1}
      sx={{
        my: 2,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {language && (
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: 'grey.100',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CodeIcon fontSize="small" color="primary" />
          <Typography variant="caption" color="primary" fontWeight="bold">
            {language.toUpperCase()}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          p: 2,
          bgcolor: 'grey.900',
          color: 'grey.100',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          overflow: 'auto'
        }}
      >
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {content}
        </pre>
      </Box>
    </Paper>
  );

  // 渲染元素
  const renderElement = (element: ParsedElement, index: number) => {
    switch (element.type) {
      case 'heading':
        const HeadingComponent = {
          1: 'h1',
          2: 'h2',
          3: 'h3',
          4: 'h4',
          5: 'h5',
          6: 'h6'
        }[element.level || 1] as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        
        const variant = {
          1: 'h3',
          2: 'h4',
          3: 'h5',
          4: 'h6',
          5: 'subtitle1',
          6: 'subtitle2'
        }[element.level || 1] as 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2';

        return (
          <Typography
            key={index}
            variant={variant}
            component={HeadingComponent}
            sx={{
              mt: element.level === 1 ? 4 : 3,
              mb: 2,
              fontWeight: 'bold',
              color: element.level === 1 ? 'primary.main' : 'text.primary'
            }}
            dangerouslySetInnerHTML={{
              __html: processInlineStyles(element.content)
            }}
          />
        );

      case 'paragraph':
        return (
          <Typography
            key={index}
            variant="body1"
            sx={{ mb: 2, lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{
              __html: processInlineStyles(element.content)
            }}
          />
        );

      case 'code':
        return renderCodeBlock(element.content, element.language);

      case 'quote':
        return (
          <Alert
            key={index}
            severity="info"
            icon={<FormatQuote />}
            sx={{
              my: 2,
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontStyle: 'italic' }}
              dangerouslySetInnerHTML={{
                __html: processInlineStyles(element.content)
              }}
            />
          </Alert>
        );

      case 'list':
        return (
          <List key={index} sx={{ my: 2 }}>
            {element.items?.map((item, itemIndex) => (
              <ListItem key={itemIndex} sx={{ py: 0.5 }}>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      dangerouslySetInnerHTML={{
                        __html: processInlineStyles(item)
                      }}
                    />
                  }
                />
              </ListItem>
            ))}
          </List>
        );

      case 'divider':
        return <Divider key={index} sx={{ my: 3 }} />;

      case 'break':
        return <Box key={index} sx={{ height: 16 }} />;

      default:
        return null;
    }
  };

  const elements = parseMarkdown(content);

  return (
    <Box
      sx={{
        '& strong': { fontWeight: 'bold' },
        '& em': { fontStyle: 'italic' },
        '& code': {
          px: 1,
          py: 0.5,
          bgcolor: 'grey.100',
          borderRadius: 1,
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          color: 'primary.main'
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        },
        '& > *:first-of-type': { mt: 0 },
        '& > *:last-child': { mb: 0 }
      }}
    >
      {elements.map((element, index) => renderElement(element, index))}
    </Box>
  );
};

export default MarkdownRenderer;