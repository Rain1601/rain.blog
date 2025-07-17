'use client';

import dynamic from 'next/dynamic';

// 动态导入InteractiveCodeBlock以避免服务端问题
const DynamicInteractiveCodeBlock = dynamic(
  () => import('@/components/InteractiveCodeBlock').then(mod => ({ default: mod.InteractiveCodeBlock })),
  { 
    ssr: false,
    loading: () => <div>Loading interactive code block...</div>
  }
);

// MDX组件映射
export const mdxComponents = {
  InteractiveCodeBlock: DynamicInteractiveCodeBlock,
  // 可以添加其他自定义组件
};