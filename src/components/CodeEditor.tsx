'use client';

import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  height?: number;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
}

export function CodeEditor({ 
  code, 
  onChange, 
  height = 200, 
  language = 'python',
  readOnly = false,
  placeholder = '# 在这里输入Python代码...'
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'var(--font-geist-mono), Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    wordWrap: 'on' as const,
    lineNumbers: 'on' as const,
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    readOnly,
    contextmenu: false,
    selectOnLineNumbers: true,
    roundedSelection: false,
    cursorStyle: 'line' as const,
    accessibilitySupport: 'off' as const,
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showFunctions: true,
      showClasses: true,
      showModules: true,
      showVariables: true,
    },
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    parameterHints: {
      enabled: true,
    },
    hover: {
      enabled: true,
    },
  };

  if (!mounted) {
    return (
      <div 
        className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
        style={{ height }}
      >
        <div className="text-gray-500 dark:text-gray-400 font-mono text-sm">
          {placeholder}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
        options={editorOptions}
        beforeMount={(monaco) => {
          // 配置Python语言特性
          monaco.languages.setLanguageConfiguration('python', {
            indentationRules: {
              increaseIndentPattern: /^\s*(def|class|if|elif|else|for|while|try|except|finally|with|async\s+def).*:\s*$/,
              decreaseIndentPattern: /^\s*(except|finally|elif|else).*:\s*$/,
            },
            onEnterRules: [
              {
                beforeText: /^\s*(def|class|if|elif|else|for|while|try|except|finally|with|async\s+def).*:\s*$/,
                action: { indentAction: monaco.languages.IndentAction.Indent },
              },
            ],
          });
        }}
        onMount={(editor, monaco) => {
          // 编辑器挂载后的配置
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            // Ctrl+Enter快捷键可以用于运行代码
            const runEvent = new CustomEvent('runCode', { detail: { code: editor.getValue() } });
            window.dispatchEvent(runEvent);
          });
        }}
      />
    </div>
  );
} 