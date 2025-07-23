#!/bin/bash

# 安全启动脚本 - Rain's Blog 开发服务器
# 作用：检查端口占用，清理旧进程，安全启动开发服务器

echo "🚀 Rain's Blog 安全启动脚本"
echo "================================"

# 检查是否在正确的项目目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Node.js 版本
NODE_VERSION=$(node -v)
echo "📦 Node.js 版本: $NODE_VERSION"

# 检查 npm 版本
NPM_VERSION=$(npm -v)
echo "📦 npm 版本: $NPM_VERSION"

# 检查端口 3001 是否被占用
PORT=3001
echo ""
echo "🔍 检查端口 $PORT 占用情况..."

if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "⚠️  端口 $PORT 已被占用，正在尝试清理..."
    
    # 获取占用端口的进程PID
    PIDS=$(lsof -ti:$PORT)
    
    for PID in $PIDS; do
        # 获取进程信息
        PROCESS_INFO=$(ps -p $PID -o comm= 2>/dev/null || echo "未知进程")
        echo "   找到进程: PID=$PID, 命令=$PROCESS_INFO"
        
        # 尝试优雅关闭
        echo "   尝试优雅关闭进程 $PID..."
        kill -TERM $PID 2>/dev/null
        
        # 等待 3 秒
        sleep 3
        
        # 检查进程是否还在运行
        if kill -0 $PID 2>/dev/null; then
            echo "   强制终止进程 $PID..."
            kill -9 $PID 2>/dev/null
        fi
    done
    
    # 再次检查端口
    sleep 1
    if lsof -ti:$PORT > /dev/null 2>&1; then
        echo "❌ 无法清理端口 $PORT，请手动处理"
        exit 1
    else
        echo "✅ 端口 $PORT 已清理完成"
    fi
else
    echo "✅ 端口 $PORT 可用"
fi

# 检查依赖是否已安装
echo ""
echo "📚 检查项目依赖..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules 不存在，正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
else
    echo "✅ 项目依赖已就绪"
fi

# 清理 Next.js 缓存
echo ""
echo "🧹 清理 Next.js 缓存..."
rm -rf .next
echo "✅ 缓存清理完成"

# 设置环境变量
export NODE_ENV=development
export PORT=$PORT

echo ""
echo "🔧 环境配置:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"
echo "   项目目录: $(pwd)"

echo ""
echo "🚀 启动开发服务器..."
echo "================================"
echo ""

# 启动开发服务器
npm run dev

# 如果脚本被中断，清理进程
trap 'echo ""; echo "🛑 正在安全关闭服务器..."; kill -TERM $! 2>/dev/null; exit 0' SIGINT SIGTERM