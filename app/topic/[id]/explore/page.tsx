import { getAllTopics } from '@/topics';
import JungleExplorePageClient from './JungleExplorePageClient';

export function generateStaticParams() {
  return getAllTopics().map((topic) => ({
    id: topic.id,
  }));
}

export default function TopicExplorePage() {
  return <JungleExplorePageClient />;
}
