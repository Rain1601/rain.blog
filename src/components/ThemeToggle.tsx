'use client'

import { useTheme } from './ThemeProvider'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md border border-neutral-200 dark:border-neutral-700 animate-pulse bg-neutral-100 dark:bg-neutral-800" />
    )
  }

  const handleThemeChange = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (theme === 'system') {
      return <SystemIcon />
    }
    return resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />
  }

  const getLabel = () => {
    if (theme === 'system') {
      return '系统模式'
    }
    return resolvedTheme === 'dark' ? '深色模式' : '浅色模式'
  }

  return (
    <button
      onClick={handleThemeChange}
      className="
        relative w-9 h-9 rounded-md
        bg-neutral-100 hover:bg-neutral-200 
        dark:bg-neutral-800 dark:hover:bg-neutral-700
        border border-neutral-200 dark:border-neutral-700
        transition-all duration-200 ease-soft
        flex items-center justify-center
        group
        hover:scale-105 active:scale-95
      "
      aria-label={`切换到${getLabel()}`}
      title={`当前: ${getLabel()}`}
    >
      <div className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors duration-200">
        {getIcon()}
      </div>
      
      {/* 主题指示器 */}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 transition-all duration-200">
        {theme === 'light' && (
          <div className="w-full h-full bg-amber-400 rounded-full" />
        )}
        {theme === 'dark' && (
          <div className="w-full h-full bg-blue-600 rounded-full" />
        )}
        {theme === 'system' && (
          <div className="w-full h-full bg-gradient-to-r from-amber-400 to-blue-600 rounded-full" />
        )}
      </div>
    </button>
  )
}

// 太阳图标
function SunIcon() {
  return (
    <svg
      className="w-5 h-5 transition-transform duration-200 rotate-0 group-hover:rotate-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

// 月亮图标
function MoonIcon() {
  return (
    <svg
      className="w-5 h-5 transition-transform duration-200 rotate-0 group-hover:-rotate-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

// 系统图标
function SystemIcon() {
  return (
    <svg
      className="w-5 h-5 transition-transform duration-200 scale-100 group-hover:scale-110"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

// 下拉菜单版本（可选）
export function ThemeDropdown() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-32 h-9 rounded-md border border-neutral-200 dark:border-neutral-700 animate-pulse bg-neutral-100 dark:bg-neutral-800" />
    )
  }

  const themes = [
    { value: 'light', label: '浅色模式', icon: <SunIcon /> },
    { value: 'dark', label: '深色模式', icon: <MoonIcon /> },
    { value: 'system', label: '系统模式', icon: <SystemIcon /> },
  ]

  const currentTheme = themes.find(t => t.value === theme)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-3 py-2 rounded-md
          bg-neutral-100 hover:bg-neutral-200 
          dark:bg-neutral-800 dark:hover:bg-neutral-700
          border border-neutral-200 dark:border-neutral-700
          transition-all duration-200 ease-soft
          text-sm font-medium
          text-neutral-700 dark:text-neutral-300
        "
      >
        <div className="w-4 h-4">
          {currentTheme?.icon}
        </div>
        <span>{currentTheme?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="
          absolute top-full mt-2 right-0 w-40
          bg-white dark:bg-neutral-900
          border border-neutral-200 dark:border-neutral-700
          rounded-lg shadow-soft-lg
          py-1 z-50
          animate-fade-in
        ">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => {
                setTheme(themeOption.value as any)
                setIsOpen(false)
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2
                text-sm font-medium
                transition-colors duration-200
                ${theme === themeOption.value 
                  ? 'bg-accent-soft text-accent-600' 
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }
              `}
            >
              <div className="w-4 h-4">
                {themeOption.icon}
              </div>
              <span>{themeOption.label}</span>
              {theme === themeOption.value && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 