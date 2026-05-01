import { ReactNode } from 'react';

export default function TopicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">{children}</div>;
}
