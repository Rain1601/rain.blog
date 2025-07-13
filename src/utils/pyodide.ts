export interface ExecutionResult {
  output: string;
  error: string | null;
  success: boolean;
  executionTime: number;
}

interface PyodideInterface {
  runPython: (code: string) => unknown;
  loadPackage: (packages: string[]) => Promise<unknown>;
  globals: Record<string, unknown>;
}

declare global {
  interface Window {
    loadPyodide: (options: {
      indexURL: string;
      stdout?: (text: string) => void;
      stderr?: (text: string) => void;
    }) => Promise<PyodideInterface>;
  }
}

class PyodideManager {
  private pyodide: PyodideInterface | null = null;
  private isLoading = false;
  private loadingPromise: Promise<PyodideInterface> | null = null;

  /**
   * 单例模式获取Pyodide实例
   */
  async getPyodide(): Promise<PyodideInterface> {
    if (this.pyodide) {
      return this.pyodide;
    }

    if (this.isLoading && this.loadingPromise) {
      return this.loadingPromise;
    }

    this.isLoading = true;
    this.loadingPromise = this.loadPyodide();
    
    try {
      this.pyodide = await this.loadingPromise;
      return this.pyodide;
    } finally {
      this.isLoading = false;
      this.loadingPromise = null;
    }
  }

  /**
   * 加载Pyodide
   */
  private async loadPyodide(): Promise<PyodideInterface> {
    try {
      // 从CDN加载Pyodide脚本
      if (typeof window !== 'undefined' && !window.loadPyodide) {
        await this.loadPyodideScript();
      }
      
      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.28.0/full/',
        stdout: (text: string) => {
          console.log('Python stdout:', text);
        },
        stderr: (text: string) => {
          console.error('Python stderr:', text);
        },
      });

      // 先加载micropip包（必须先加载）
      try {
        await pyodide.loadPackage(['micropip']);
        console.log('✅ micropip包加载成功');
      } catch (e) {
        console.error('❌ micropip包加载失败:', e);
        throw new Error('无法加载micropip包');
      }

      // 安装常用的Python包
      try {
        await pyodide.loadPackage(['numpy', 'pandas', 'openai']);
        console.log('✅ 常用Python包加载成功（包括OpenAI 1.68.2）');
      } catch (e) {
        console.warn('⚠️ 部分Python包加载失败:', e);
      }
      
      return pyodide;
    } catch (error) {
      console.error('Failed to load Pyodide:', error);
      throw new Error('无法加载Python运行环境');
    }
  }

  /**
   * 从CDN加载Pyodide脚本
   */
  private async loadPyodideScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.28.0/full/pyodide.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Pyodide script'));
      document.head.appendChild(script);
    });
  }

  /**
   * 执行Python代码
   */
  async executeCode(code: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      const pyodide = await this.getPyodide();
      
      // 设置输出捕获
      let output = '';
      let error = '';
      
      // 重定向stdout和stderr
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

      // 执行用户代码
      let result;
      try {
        result = pyodide.runPython(code);
      } catch (e) {
        error = String(e);
      }

      // 获取输出
      output = String(pyodide.runPython('sys.stdout.getvalue()'));
      const stderr_output = String(pyodide.runPython('sys.stderr.getvalue()'));
      
      if (stderr_output) {
        error = stderr_output;
      }

      // 恢复stdout和stderr
      pyodide.runPython(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

      // 如果有返回值且没有print输出，显示返回值
      if (result !== undefined && result !== null && !output && !error) {
        output = String(result);
      }

      const executionTime = Date.now() - startTime;
      
      return {
        output: output || '',
        error: error || null,
        success: !error,
        executionTime,
      };
    } catch (e) {
      const executionTime = Date.now() - startTime;
      return {
        output: '',
        error: `执行错误: ${String(e)}`,
        success: false,
        executionTime,
      };
    }
  }

  /**
   * 清理Pyodide环境
   */
  async clearNamespace(): Promise<void> {
    if (this.pyodide) {
      try {
        this.pyodide.runPython(`
# 清理用户定义的变量，保留内建变量
import builtins
builtins_names = set(dir(builtins))
current_names = set(globals().keys())
user_names = current_names - builtins_names - {'builtins', '__builtins__'}
for name in user_names:
    if not name.startswith('_'):
        del globals()[name]
`);
      } catch (e) {
        console.error('清理命名空间失败:', e);
      }
    }
  }

  /**
   * 检查Pyodide是否可用
   */
  isReady(): boolean {
    return this.pyodide !== null;
  }

  /**
   * 获取加载状态
   */
  isLoadingPyodide(): boolean {
    return this.isLoading;
  }
}

// 单例实例
export const pyodideManager = new PyodideManager();

// 便捷函数
export const executeCode = (code: string) => pyodideManager.executeCode(code);
export const clearNamespace = () => pyodideManager.clearNamespace();
export const isReady = () => pyodideManager.isReady();
export const isLoading = () => pyodideManager.isLoadingPyodide(); 