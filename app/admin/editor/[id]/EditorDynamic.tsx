'use client';

import dynamic from 'next/dynamic';
import { generateEditorJSX } from '@/lib/editor-mapper';
import type { SiteBriefing } from '@/lib/site-generator';

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
  template,
  palette,
  selectedModules,
  contentNotes,
}: {
  briefingId: string;
  segment: string;
  template?: string | null;
  palette?: string | null;
  selectedModules?: string[] | null;
  contentNotes?: string | null;
}) {
  // Create a minimal briefing-like object for the editor mapper
  const briefing: SiteBriefing = {
    id: briefingId,
    segment,
    goal: 'whatsapp',
    palette: palette ?? 'corporate',
    template: template ?? 'portfolio',
    selected_modules: selectedModules ?? [],
    domain: null,
    domain_choice: 'later' as const,
    whatsapp_number: null,
    business_hours: null,
    catalog_products: [],
    logo_name: null,
    content_notes: contentNotes ?? null,
    created_at: new Date().toISOString(),
  };

  return <EditorClientLazy briefingId={briefingId} segment={segment} initialContent={generateEditorJSX(briefing)} />;
}
