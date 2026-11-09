import { githubAPI } from '@/utils/github';
import AboutClient from './AboutClient';

// 内容来自内容仓库的 about.json；5 分钟重新生成，后台发布后立即失效
export const revalidate = 300;

export default async function AboutPage() {
  const about = await githubAPI.getAbout();
  return <AboutClient about={about} />;
}
