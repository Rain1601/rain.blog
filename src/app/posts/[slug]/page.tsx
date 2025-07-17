import { notFound } from 'next/navigation';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Simple validation
  const validSlugs = ['python-basics', 'openai-integration', 'data-analysis'];
  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Post: {slug}</h1>
      <p>This is a minimal page to test the build.</p>
    </div>
  );
}