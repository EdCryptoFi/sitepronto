import { createClient } from '@supabase/supabase-js';
import EditorDynamic from './EditorDynamic';

type BriefingData = {
  id: string;
  segment: string;
  template: string | null;
  palette: string | null;
  selected_modules: string[] | null;
  content_notes: string | null;
};

async function getBriefing(id: string): Promise<BriefingData> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { id, segment: 'desconhecido', template: null, palette: null, selected_modules: null, content_notes: null };

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('briefings')
    .select('id, segment, template, palette, selected_modules, content_notes')
    .eq('id', id)
    .single();

  return data ?? { id, segment: 'desconhecido', template: null, palette: null, selected_modules: null, content_notes: null };
}

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const briefing = await getBriefing(id);

  return (
    <EditorDynamic
      briefingId={briefing.id}
      segment={briefing.segment}
      template={briefing.template}
      palette={briefing.palette}
      selectedModules={briefing.selected_modules}
      contentNotes={briefing.content_notes}
    />
  );
}
