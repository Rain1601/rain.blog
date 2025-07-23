# GitHub API 配置指南

由于GitHub API的速率限制，您需要配置访问令牌以获得最佳体验。

## 问题说明

GitHub API对未认证的请求有严格限制：
- **未认证请求**: 每小时60次请求
- **认证请求**: 每小时5000次请求

当达到速率限制时，博客会显示演示数据而非真实的GitHub仓库内容。

## 解决方案

### 方法1: 添加GitHub Personal Access Token (推荐)

1. **访问GitHub设置**
   - 登录GitHub账号
   - 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)

2. **创建新令牌**
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 添加描述，如 "Rain Blog API Access"
   - 选择过期时间（建议30天或更长）

3. **选择权限**
   - 勾选 `public_repo` (访问公开仓库)
   - 如果是私有仓库，需要选择 `repo` (完整仓库访问权限)

4. **生成并保存令牌**
   - 点击 "Generate token"
   - **重要**: 立即复制令牌，关闭页面后无法再次查看

5. **配置项目**
   - 在项目根目录创建 `.env` 文件
   - 添加以下内容：
   ```bash
   GITHUB_TOKEN=your_copied_token_here
   ```

6. **重启开发服务器**
   ```bash
   ./quick-start.sh
   ```

### 方法2: 等待速率限制重置

如果不想配置令牌，可以：
- 等待速率限制重置（每小时重置一次）
- 在此期间，博客会显示演示数据

## 验证配置

配置成功后，您应该能看到：
- 实时的GitHub仓库内容
- 更快的加载速度
- 不再出现"速率限制"错误

## 安全注意事项

⚠️ **重要提醒**:
- 不要将 `.env` 文件提交到Git仓库
- `.env` 文件已在 `.gitignore` 中被忽略
- 定期轮换访问令牌
- 只给予必要的最小权限

## 故障排除

如果配置后仍有问题：

1. **检查令牌格式**
   ```bash
   # 正确格式
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **验证权限**
   - 确保令牌有 `public_repo` 权限
   - 检查仓库是否为公开状态

3. **重启服务器**
   - 环境变量更改需要重启开发服务器

4. **查看控制台**
   - 打开浏览器开发者工具
   - 查看Console标签页的错误信息

## 仓库配置

当前配置的GitHub仓库：
- 用户: `Rain1601`
- 仓库: `rain.blog.repo`
- 路径: `posts/`

如需修改，请编辑 `src/utils/github.ts` 中的配置。

## 联系支持

如果仍有问题，请：
1. 检查GitHub仓库是否存在且为公开
2. 验证网络连接
3. 查看浏览器控制台的详细错误信息