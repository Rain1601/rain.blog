export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  path: string;
  date: string;
  year: string;
  month: string;
  size: number;
  sha: string;
  url: string;
}

class GitHubAPI {
  private readonly REPO_OWNER = 'Rain1601';
  private readonly REPO_NAME = 'rain.blog.repo';
  private readonly BASE_URL = 'https://api.github.com';
  private readonly POSTS_PATH = 'posts';

  /**
   * 获取GitHub API URL
   */
  private getApiUrl(path: string): string {
    return `${this.BASE_URL}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${path}`;
  }

  /**
   * 发送GitHub API请求
   */
  private async fetchFromGitHub(url: string): Promise<unknown> {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Rain-Blog-App',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
          })
        },
        next: { revalidate: 300 } // 缓存5分钟
      });

      // 详细的错误处理
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `GitHub API错误: ${response.status} ${response.statusText}`;
        
        // 特殊处理常见错误
        if (response.status === 403) {
          const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
          const rateLimitReset = response.headers.get('x-ratelimit-reset');
          
          if (rateLimitRemaining === '0') {
            const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000) : null;
            errorMessage = `GitHub API速率限制已用完${resetTime ? `，将在 ${resetTime.toLocaleTimeString()} 重置` : ''}。建议添加 GITHUB_TOKEN 环境变量以获得更高的速率限制。`;
          } else {
            errorMessage = 'GitHub API访问被拒绝，请检查仓库权限或添加访问令牌。';
          }
        } else if (response.status === 404) {
          errorMessage = 'GitHub仓库或路径不存在，请检查仓库配置。';
        }
        
        console.error('GitHub API详细错误:', {
          url,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error('GitHub API请求失败:', {
          message: error.message,
          url,
          stack: error.stack
        });
      } else {
        console.error('GitHub API请求失败:', error);
      }
      throw error;
    }
  }

  /**
   * 递归获取所有博客文档
   */
  private async getAllFiles(path: string = this.POSTS_PATH): Promise<GitHubFile[]> {
    const url = this.getApiUrl(path);
    const items = await this.fetchFromGitHub(url);
    
    if (!Array.isArray(items)) {
      return [];
    }

    const files: GitHubFile[] = [];

    for (const item of items) {
      if (item.type === 'dir') {
        // 递归获取目录中的文件
        const subFiles = await this.getAllFiles(item.path);
        files.push(...subFiles);
      } else if (item.type === 'file' && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
        files.push(item);
      }
    }

    return files;
  }

  /**
   * 获取文件内容
   */
  private async getFileContent(file: GitHubFile): Promise<string> {
    try {
      const response = await fetch(file.download_url, {
        next: { revalidate: 300 }
      });
      
      if (!response.ok) {
        throw new Error(`下载文件失败: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error(`获取文件内容失败: ${file.path}`, error);
      throw error;
    }
  }

  /**
   * 从文件路径解析年份和月份
   */
  private parsePathInfo(path: string): { year: string; month: string } {
    const pathParts = path.split('/');
    // posts/2025/07/filename.md
    const year = pathParts[1] || 'unknown';
    const month = pathParts[2] || 'unknown';
    return { year, month };
  }

  /**
   * 从文件名提取标题
   */
  private extractTitle(filename: string): string {
    // 移除文件扩展名
    return filename.replace(/\.(md|mdx)$/, '');
  }

  /**
   * 生成唯一ID
   */
  private generateId(path: string): string {
    return path.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  }

  /**
   * 创建演示数据（当GitHub API不可用时）
   */
  private createDemoData(): BlogPost[] {
    return [
      {
        id: 'demo-welcome',
        title: '欢迎来到 Rain\'s Blog',
        content: `# 欢迎来到我的博客

这是一个基于GitHub仓库动态加载的博客系统。

## 特性

- 🚀 实时从GitHub仓库同步内容
- 📱 响应式设计，支持各种设备
- 🔍 强大的搜索和筛选功能
- 📅 时间线样式展示
- ⚡ 现代化的用户界面

## 当前状态

由于GitHub API速率限制，当前显示的是演示数据。

**解决方案：**
1. 等待速率限制重置（每小时重置）
2. 添加GitHub Personal Access Token以获得更高的速率限制
3. 查看项目文档了解如何配置

感谢您的耐心等待！`,
        path: 'demo/welcome.md',
        date: '2025-01',
        year: '2025',
        month: '01',
        size: 500,
        sha: 'demo-sha',
        url: 'https://github.com/Rain1601/rain.blog.repo'
      },
      {
        id: 'demo-github-api',
        title: 'GitHub API 速率限制说明',
        content: `# GitHub API 速率限制

GitHub API对未认证的请求有严格的速率限制。

## 限制详情

- **未认证请求**: 每小时60次
- **认证请求**: 每小时5000次

## 如何解决

1. **等待重置**: 速率限制每小时重置一次
2. **添加Token**: 在项目根目录创建 \`.env\` 文件：

\`\`\`
GITHUB_TOKEN=your_token_here
\`\`\`

3. **获取Token**: 访问 GitHub Settings > Developer settings > Personal access tokens

## 注意事项

- Token只需要 \`public_repo\` 权限
- 不要将Token提交到代码仓库
- Token可以显著提高API访问限制`,
        path: 'demo/github-api.md',
        date: '2025-01',
        year: '2025',
        month: '01',
        size: 400,
        sha: 'demo-sha-2',
        url: 'https://github.com/Rain1601/rain.blog.repo'
      }
    ];
  }

  /**
   * 获取所有博客文章
   */
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const files = await this.getAllFiles();
      const posts: BlogPost[] = [];

      for (const file of files) {
        try {
          const content = await this.getFileContent(file);
          const pathInfo = this.parsePathInfo(file.path);
          const title = this.extractTitle(file.name);
          
          const post: BlogPost = {
            id: this.generateId(file.path),
            title,
            content,
            path: file.path,
            date: `${pathInfo.year}-${pathInfo.month}`,
            year: pathInfo.year,
            month: pathInfo.month,
            size: file.size,
            sha: file.sha,
            url: file.html_url
          };

          posts.push(post);
        } catch (error) {
          console.warn(`跳过文件 ${file.path}:`, error);
          continue;
        }
      }

      // 按日期排序（最新的在前）
      posts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      return posts;
    } catch (error) {
      console.error('获取博客文章失败，使用演示数据:', error);
      
      // 如果是速率限制错误，返回演示数据而不是空数组
      if (error instanceof Error && error.message.includes('速率限制')) {
        return this.createDemoData();
      }
      
      return [];
    }
  }

  /**
   * 根据ID获取单篇文章
   */
  async getPostById(id: string): Promise<BlogPost | null> {
    try {
      const posts = await this.getAllPosts();
      return posts.find(post => post.id === id) || null;
    } catch (error) {
      console.error('获取文章失败:', error);
      return null;
    }
  }

  /**
   * 根据年份获取文章
   */
  async getPostsByYear(year: string): Promise<BlogPost[]> {
    try {
      const posts = await this.getAllPosts();
      return posts.filter(post => post.year === year);
    } catch (error) {
      console.error('获取年份文章失败:', error);
      return [];
    }
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string): Promise<BlogPost[]> {
    try {
      const posts = await this.getAllPosts();
      const lowerQuery = query.toLowerCase();
      
      return posts.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('搜索文章失败:', error);
      return [];
    }
  }

  /**
   * 获取统计信息
   */
  async getStats(): Promise<{
    totalPosts: number;
    years: string[];
    latestPost?: BlogPost;
  }> {
    try {
      const posts = await this.getAllPosts();
      const years = [...new Set(posts.map(post => post.year))].sort().reverse();
      
      return {
        totalPosts: posts.length,
        years,
        latestPost: posts[0] || undefined
      };
    } catch (error) {
      console.error('获取统计信息失败:', error);
      // 如果获取失败，提供基本统计信息
      const demoPosts = this.createDemoData();
      return {
        totalPosts: demoPosts.length,
        years: ['2025'],
        latestPost: demoPosts[0]
      };
    }
  }
}

// 单例实例
export const githubAPI = new GitHubAPI();

// 便捷函数
export const getAllPosts = () => githubAPI.getAllPosts();
export const getPostById = (id: string) => githubAPI.getPostById(id);
export const getPostsByYear = (year: string) => githubAPI.getPostsByYear(year);
export const searchPosts = (query: string) => githubAPI.searchPosts(query);
export const getStats = () => githubAPI.getStats();