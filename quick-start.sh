#!/bin/bash

# 快速启动脚本 - Rain's Blog
# 简化版启动脚本，仅做基本检查

echo "⚡ Rain's Blog 快速启动"

# 检查端口并清理
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "🔄 清理端口 3001..."
    kill -9 $(lsof -ti:3001) 2>/dev/null
    sleep 2
fi

echo "🚀 启动开发服务器..."
npm run dev