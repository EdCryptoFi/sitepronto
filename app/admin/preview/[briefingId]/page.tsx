import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import PreviewFrame from './PreviewFrame';

async function getBriefing(id: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('briefings')
    .select('id, domain, template, palette, selected_modules')
    .eq('id', id)
    .single();
  return data;
}

export default async function AdminPreviewPage({
  params,
}: {
  params: Promise<{ briefingId: string }>;
}) {
  const { briefingId } = await params;
  const briefing = await getBriefing(briefingId);
  if (!briefing) notFound();

  return <PreviewFrame briefing={briefing} />;
}
