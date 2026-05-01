import { getAllTopics } from '@/topics';
import ExercisePageClient from './ExercisePageClient';

export function generateStaticParams() {
  const topics = getAllTopics();
  const params: { id: string; exerciseId: string }[] = [];
  
  topics.forEach((topic) => {
    topic.games.forEach((game) => {
      params.push({
        id: topic.id,
        exerciseId: game.id,
      });
    });
  });
  
  return params;
}

export default function ExercisePage() {
  return <ExercisePageClient />;
}
