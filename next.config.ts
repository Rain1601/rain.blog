import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  webpack: (config, { isServer }) => {
    // 支持Pyodide在浏览器中运行
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        child_process: false,
        "node:fs": false,
        "node:path": false,
        "node:crypto": false,
        "node:child_process": false,
        "node:fs/promises": false,
      };
    }
    
    // 添加对node:模块的处理
    config.resolve.alias = {
      ...config.resolve.alias,
      "node:fs": false,
      "node:path": false,
      "node:crypto": false,
      "node:child_process": false,
      "node:fs/promises": false,
    };
    
    return config;
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
