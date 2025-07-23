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
          'User-Agent': 'PyBlog-App'
        },
        next: { revalidate: 300 } // 缓存5分钟
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GitHub API请求失败:', error);
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
      console.error('获取博客文章失败:', error);
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
      return {
        totalPosts: 0,
        years: []
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