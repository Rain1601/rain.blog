'use client';

import { MDXProvider } from '@mdx-js/react';
import { mdxComponents } from './MDXComponents';

interface MDXWrapperProps {
  children: React.ReactNode;
}

export function MDXWrapper({ children }: MDXWrapperProps) {
  return (
    <MDXProvider components={mdxComponents}>
      {children}
    </MDXProvider>
  );
}