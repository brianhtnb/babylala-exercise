import { ReactNode } from 'react';

export default function TopicLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-app">{children}</div>;
}
