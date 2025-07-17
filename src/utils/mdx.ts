import { getBlogConfig } from './posts';
import { InteractiveCodeBlock } from '@/components/InteractiveCodeBlock';

// MDX文件路径映射
const MDX_FILES = {
  'python-basics': () => import('@/content/blog/posts/python-basics.mdx'),
  'openai-integration': () => import('@/content/blog/posts/openai-integration.mdx'),
  'data-analysis': () => import('@/content/blog/posts/data-analysis.mdx'),
} as const;

// MDX组件映射
export const mdxComponents = {
  InteractiveCodeBlock,
  // 可以添加其他自定义组件
};

export type MDXSlug = keyof typeof MDX_FILES;

export async function getMDXContent(slug: string) {
  if (!(slug in MDX_FILES)) {
    return null;
  }
  
  try {
    const mdxModule = await MDX_FILES[slug as MDXSlug]();
    return mdxModule.default;
  } catch (error) {
    console.error(`Error loading MDX file for slug: ${slug}`, error);
    return null;
  }
}

// 获取所有可用的MDX文件slug
export function getAvailableMDXSlugs(): string[] {
  return Object.keys(MDX_FILES);
}

// 检查MDX文件是否存在
export function hasMDXFile(slug: string): boolean {
  return slug in MDX_FILES;
}

// 获取文章的完整信息（包括MDX内容和配置）
export async function getPostWithContent(slug: string) {
  const config = getBlogConfig(slug);
  const MDXContent = await getMDXContent(slug);
  
  if (!config || !MDXContent) {
    return null;
  }
  
  return {
    config,
    MDXContent,
    slug
  };
} 