import { numbersConfig } from './numbers-11-20/config';
import { TopicConfig } from '@/types';

export const topics: TopicConfig[] = [numbersConfig];

export function getTopicById(id: string): TopicConfig | undefined {
  return topics.find((t) => t.id === id);
}

export function getAllTopics(): TopicConfig[] {
  return topics;
}
