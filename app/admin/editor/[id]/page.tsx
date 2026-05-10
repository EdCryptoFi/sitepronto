import { createClient } from '@supabase/supabase-js';
import EditorDynamic from './EditorDynamic';

async function getBriefing(id: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { id, segment: 'desconhecido' };

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('briefings')
    .select('id, segment, template')
    .eq('id', id)
    .single();

  return data ?? { id, segment: 'desconhecido' };
}

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const briefing = await getBriefing(id);

  return (
    <EditorDynamic
      briefingId={briefing.id}
      segment={briefing.segment}
    />
  );
}
