'use client';

import { Editor } from '@monaco-editor/react';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState, useMemo } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  height?: number;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
  showLineNumbers?: boolean;
  showMinimap?: boolean;
  onRun?: (code: string) => void;
}

export function CodeEditor({ 
  code, 
  onChange, 
  height = 200, 
  language = 'python',
  readOnly = false,
  placeholder = '# 在这里输入Python代码...',
  showLineNumbers = true,
  showMinimap = false,
  onRun
}: CodeEditorProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const editorOptions = {
    minimap: { enabled: showMinimap },
    fontSize: 14,
    lineHeight: 21,
    fontFamily: '"JetBrains Mono", "Fira Code", Consolas, Monaco, monospace',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    insertSpaces: true,
    wordWrap: 'on' as const,
    lineNumbers: showLineNumbers ? 'on' as const : 'off' as const,
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    readOnly,
    contextmenu: !readOnly,
    selectOnLineNumbers: true,
    roundedSelection: false,
    cursorStyle: 'line' as const,
    cursorBlinking: 'blink' as const,
    accessibilitySupport: 'off' as const,
    smoothScrolling: true,
    renderWhitespace: 'none' as const,
    renderControlCharacters: false,
    fontLigatures: true,
    letterSpacing: 0.5,
    // 智能提示配置
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showFunctions: true,
      showClasses: true,
      showModules: true,
      showVariables: true,
      showWords: true,
      showMethods: true,
      showProperties: true,
      showConstructors: true,
      showFields: true,
      showTypes: true,
      showConstants: true,
      showEnums: true,
      showEvents: true,
      showOperators: true,
      showUnits: true,
      showValues: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showFolders: true,
      showTypeParameters: true,
      showUsers: true,
      showIssues: true,
      showStructs: true,
      showInterfaces: true,
      showText: true,
      localityBonus: true,
      insertMode: 'insert' as const,
      filterGraceful: true,
      snippetsPreventQuickSuggestions: false,
    },
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    parameterHints: {
      enabled: true,
      cycle: true,
    },
    hover: {
      enabled: true,
      delay: 300,
    },
    // 格式化配置
    formatOnType: true,
    formatOnPaste: true,
    // 缩进指引
    renderIndentGuides: true,
    // 括号匹配
    matchBrackets: 'always' as const,
    // 选中高亮
    occurrencesHighlight: 'singleFile' as const,
    selectionHighlight: true,
    // 滚动条
    scrollbar: {
      vertical: 'auto' as const,
      horizontal: 'auto' as const,
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
  };

  const editorTheme = useMemo(() => ({
    base: 'vs-dark' as const,
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955' },
      { token: 'keyword', foreground: 'C586C0' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'delimiter', foreground: 'D4D4D4' },
      { token: 'type', foreground: '4EC9B0' },
      { token: 'function', foreground: 'DCDCAA' },
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'identifier', foreground: '9CDCFE' },
    ],
    colors: {
      'editor.background': '#111827',
      'editor.foreground': '#E5E7EB',
      'editorLineNumber.foreground': '#6B7280',
      'editorLineNumber.activeForeground': '#9CA3AF',
      'editor.selectionBackground': '#374151',
      'editor.lineHighlightBackground': '#1F2937',
      'editorCursor.foreground': '#F3F4F6',
      'editorWhitespace.foreground': '#4B5563',
      'editorIndentGuide.background': '#374151',
      'editorIndentGuide.activeBackground': '#6B7280',
      'editor.selectionHighlightBackground': '#4B5563',
      'editor.wordHighlightBackground': '#4B5563',
      'editor.wordHighlightStrongBackground': '#6B7280',
      'editorBracketMatch.background': '#6B7280',
      'editorBracketMatch.border': '#9CA3AF',
    }
  }), []);

  // 自定义语法高亮提供者
  const tokenProvider = useMemo(() => ({
    getInitialState: () => ({ line: 0 }),
    tokenize: (line: string) => {
      const tokens = [];
      let currentIndex = 0;
      
      // 简单的Python语法高亮规则
      const patterns = [
        { regex: /#.*$/, tokenType: 'comment' },
        { regex: /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|pass|break|continue|and|or|not|in|is|lambda|global|nonlocal)\b/, tokenType: 'keyword' },
        { regex: /\b(True|False|None)\b/, tokenType: 'keyword' },
        { regex: /\b\d+\.?\d*\b/, tokenType: 'number' },
        { regex: /"[^"]*"|'[^']*'/, tokenType: 'string' },
        { regex: /[+\-*/=<>!&|%^~]/, tokenType: 'operator' },
        { regex: /[()[\]{},:;.]/, tokenType: 'delimiter' },
        { regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/, tokenType: 'identifier' },
      ];

      while (currentIndex < line.length) {
        let matched = false;
        
        for (const pattern of patterns) {
          const regex = new RegExp(pattern.regex.source, 'g');
          regex.lastIndex = currentIndex;
          const match = regex.exec(line);
          
          if (match && match.index === currentIndex) {
            tokens.push({
              startIndex: currentIndex,
              scopes: pattern.tokenType
            });
            currentIndex = regex.lastIndex;
            matched = true;
            break;
          }
        }
        
        if (!matched) {
          currentIndex++;
        }
      }
      
      return {
        tokens,
        endState: { line: 0 }
      };
    }
  }), []);

  if (!mounted) {
    return (
      <div 
        className="code-editor border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 animate-pulse"
        style={{ height }}
      >
        <div className="text-gray-500 dark:text-gray-400 font-mono text-sm">
          {placeholder}
        </div>
      </div>
    );
  }

  return (
    <div className="code-editor border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl dark:shadow-gray-800/50">
      <Editor
        height={height}
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme={`custom-${isDark ? 'dark' : 'light'}`}
        options={editorOptions}
        beforeMount={(monaco) => {
          // 定义自定义主题
                      monaco.editor.defineTheme(`custom-${isDark ? 'dark' : 'light'}`, editorTheme);
          
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
            autoClosingPairs: [
              { open: '{', close: '}' },
              { open: '[', close: ']' },
              { open: '(', close: ')' },
              { open: '"', close: '"', notIn: ['string'] },
              { open: "'", close: "'", notIn: ['string'] },
              { open: '"""', close: '"""' },
              { open: "'''", close: "'''" },
            ],
            surroundingPairs: [
              { open: '{', close: '}' },
              { open: '[', close: ']' },
              { open: '(', close: ')' },
              { open: '"', close: '"' },
              { open: "'", close: "'" },
            ],
            comments: {
              lineComment: '#',
              blockComment: ['"""', '"""'],
            },
            brackets: [
              ['{', '}'],
              ['[', ']'],
              ['(', ')'],
            ],
            wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
          });

          // 注册Python代码片段
          monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: (model, position, context, token) => {
              const word = model.getWordUntilPosition(position);
              const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
              };

              const suggestions = [
                {
                  label: 'import',
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: 'import ${1:module}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  documentation: 'Import a module',
                  range: range,
                },
                {
                  label: 'def',
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: 'def ${1:function_name}(${2:params}):\n    ${3:pass}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  documentation: 'Define a function',
                  range: range,
                },
                {
                  label: 'class',
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: 'class ${1:ClassName}:\n    def __init__(self${2:, params}):\n        ${3:pass}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  documentation: 'Define a class',
                  range: range,
                },
                {
                  label: 'if',
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: 'if ${1:condition}:\n    ${2:pass}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  documentation: 'If statement',
                  range: range,
                },
                {
                  label: 'for',
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: 'for ${1:item} in ${2:iterable}:\n    ${3:pass}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  documentation: 'For loop',
                  range: range,
                },
                {
                  label: 'while',
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: 'while ${1:condition}:\n    ${2:pass}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  documentation: 'While loop',
                  range: range,
                },
                {
                  label: 'try',
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  documentation: 'Try-except block',
                  range: range,
                },
              ];
              return { suggestions };
            },
          });
        }}
        onMount={(editor, monaco) => {
          // 编辑器挂载后的配置
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            // Ctrl+Enter快捷键运行代码
            const code = editor.getValue();
            if (onRun) {
              onRun(code);
            } else {
              const runEvent = new CustomEvent('runCode', { detail: { code } });
            window.dispatchEvent(runEvent);
            }
          });

          // 添加格式化快捷键
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
            editor.getAction('editor.action.formatDocument')?.run();
          });

          // 添加注释快捷键
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
            editor.getAction('editor.action.commentLine')?.run();
          });

          // 设置焦点时的样式
          editor.onDidFocusEditorText(() => {
            const editorElement = editor.getDomNode();
            if (editorElement) {
              editorElement.style.outline = '2px solid #3b82f6';
              editorElement.style.outlineOffset = '2px';
            }
          });

          editor.onDidBlurEditorText(() => {
            const editorElement = editor.getDomNode();
            if (editorElement) {
              editorElement.style.outline = 'none';
            }
          });
        }}
      />
    </div>
  );
} 