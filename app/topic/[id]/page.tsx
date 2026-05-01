import { getAllTopics } from '@/topics';
import TopicPageClient from './TopicPageClient';

export function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    id: topic.id,
  }));
}

export default function TopicPage() {
  return <TopicPageClient />;
}
