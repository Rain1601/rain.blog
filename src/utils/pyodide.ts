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
        await pyodide.loadPackage(['numpy', 'pandas', 'matplotlib', 'scipy']);
        console.log('✅ 常用Python包加载成功');
      } catch (e) {
        console.warn('⚠️ 部分Python包加载失败:', e);
      }

      // 使用micropip安装更多包
      try {
        await pyodide.runPython(`
import micropip
await micropip.install(['openai', 'requests', 'seaborn', 'plotly'])
`);
        console.log('✅ 通过micropip安装的包加载成功');
      } catch (e) {
        console.warn('⚠️ micropip包安装失败:', e);
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
   * 检测代码中的导入语句并安装缺失的包
   */
  private async installMissingPackages(pyodide: PyodideInterface, code: string): Promise<void> {
    // 从代码中提取import语句 - 支持更多模式
    const importPatterns = [
      /import\s+(\w+)(?:\s+as\s+\w+)?/g,  // import package 或 import package as alias
      /from\s+(\w+)(?:\.\w+)*\s+import/g, // from package import ...
      /import\s+(\w+)\.(\w+)/g,           // import package.module
      /(\w+)\s*=\s*__import__\s*\(\s*['"]\s*(\w+)\s*['"]\s*\)/g // __import__ 语法
    ];
    
    const packages = new Set<string>();
    
    for (const pattern of importPatterns) {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        const packageName = match[1];
        if (packageName) {
          packages.add(packageName);
        }
      }
    }

    // 检查常见的import别名模式
    const aliasPatterns = [
      /import\s+matplotlib\.pyplot\s+as\s+plt/g,
      /import\s+numpy\s+as\s+np/g,
      /import\s+pandas\s+as\s+pd/g,
      /import\s+seaborn\s+as\s+sns/g
    ];
    
    for (const pattern of aliasPatterns) {
      if (pattern.test(code)) {
        if (pattern.source.includes('matplotlib')) packages.add('matplotlib');
        if (pattern.source.includes('numpy')) packages.add('numpy');
        if (pattern.source.includes('pandas')) packages.add('pandas');
        if (pattern.source.includes('seaborn')) packages.add('seaborn');
      }
    }

    // 常见包的映射关系
    const packageMapping: { [key: string]: string } = {
      'matplotlib': 'matplotlib',
      'numpy': 'numpy', 
      'pandas': 'pandas',
      'seaborn': 'seaborn',
      'cv2': 'opencv-python',
      'PIL': 'pillow',
      'sklearn': 'scikit-learn',
      'requests': 'requests',
      'plotly': 'plotly',
      'scipy': 'scipy'
    };

    // 检查和安装包
    for (const pkg of packages) {
      const actualPackage = packageMapping[pkg] || pkg;
      
      try {
        // 检查包是否已经可用
        await pyodide.runPython(`
try:
    import ${pkg}
except ImportError:
    raise ImportError("${pkg} not found")
`);
      } catch {
        // 包不可用，尝试安装
        console.log(`🔄 正在安装缺失的包: ${actualPackage}`);
        try {
          // 先尝试用pyodide.loadPackage (这些包在Pyodide中预编译)
          if (['numpy', 'pandas', 'matplotlib', 'scipy', 'sympy', 'networkx'].includes(actualPackage)) {
            await pyodide.loadPackage([actualPackage]);
          } else {
            // 用micropip安装其他包
            await pyodide.runPython(`
import micropip
await micropip.install("${actualPackage}")
`);
          }
          console.log(`✅ 成功安装包: ${actualPackage}`);
        } catch (installError) {
          console.warn(`⚠️ 安装包失败: ${actualPackage}`, installError);
          // 如果安装失败，不要阻止代码执行，让用户看到具体错误
        }
      }
    }
  }

  /**
   * 执行Python代码
   */
  async executeCode(code: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      const pyodide = await this.getPyodide();
      
      // 尝试安装代码中需要的包
      await this.installMissingPackages(pyodide, code);
      
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