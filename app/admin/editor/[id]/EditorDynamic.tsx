'use client';

import dynamic from 'next/dynamic';

const EditorClientLazy = dynamic(
  () => import('./EditorClient').then((m) => m.EditorClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  },
);

export default function EditorDynamic({
  briefingId,
  segment,
}: {
  briefingId: string;
  segment: string;
}) {
  return <EditorClientLazy briefingId={briefingId} segment={segment} />;
}
