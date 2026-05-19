'use client';

import { useState, useCallback, useEffect } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import {
  ArrowLeft, Save, Undo2, Redo2, Loader2,
  LayoutTemplate, Type, ImageIcon, Mail,
  Star, Grid3x3, HelpCircle, BarChart3, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { HeroSection, TextBlock, ImageBlock, ContactForm, ServicesSection, TestimonialsSection, GallerySection, FAQSection, StatsSection } from '@/lib/craftjs/components';

/* ─── Resolver ─── */
const resolver = { HeroSection, TextBlock, ImageBlock, ContactForm, ServicesSection, TestimonialsSection, GallerySection, FAQSection, StatsSection };

/* ─── Toolbox ─── */
const TOOLS = [
  { label: 'Hero', component: HeroSection, icon: LayoutTemplate },
  { label: 'Texto', component: TextBlock, icon: Type },
  { label: 'Serviços', component: ServicesSection, icon: Sparkles },
  { label: 'Depoimentos', component: TestimonialsSection, icon: Star },
  { label: 'Galeria', component: GallerySection, icon: Grid3x3 },
  { label: 'FAQ', component: FAQSection, icon: HelpCircle },
  { label: 'Estatísticas', component: StatsSection, icon: BarChart3 },
  { label: 'Imagem', component: ImageBlock, icon: ImageIcon },
  { label: 'Contato', component: ContactForm, icon: Mail },
];

function Toolbox() {
  const { connectors } = useEditor();
  return (
    <div className="w-52 shrink-0 border-r border-[color:var(--outline-variant)] bg-surface-low p-4">
      <p className="mb-3 text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
        Componentes
      </p>
      <div className="space-y-2">
        {TOOLS.map(({ label, component, icon: Icon }) => (
          <div
            key={label}
            ref={(ref) => { if (ref) connectors.create(ref, <Element is={component} canvas />); }}
            className="flex cursor-grab items-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-label-md font-semibold shadow-sm ring-1 ring-[color:var(--outline-variant)] transition hover:bg-primary/5 hover:ring-primary active:scale-95"
          >
            <Icon size={15} className="text-primary" />
            {label}
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-on-surface-variant">
        Arraste um componente para a área de edição →
      </p>
    </div>
  );
}

/* ─── Properties Panel ─── */
function PropertiesPanel() {
  const { selected } = useEditor((state) => {
    const selectedId = state.events.selected;
    if (!selectedId || selectedId.size === 0) return { selected: null };
    const id = Array.from(selectedId)[0];
    const node = state.nodes[id];
    if (!node) return { selected: null };
    const Toolbar = node.related?.toolbar;
    return { selected: { id, displayName: node.data.displayName, Toolbar } };
  });

  return (
    <div className="w-60 shrink-0 overflow-y-auto border-l border-[color:var(--outline-variant)] bg-surface-low">
      <p className="px-4 py-3 text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
        Propriedades
      </p>
      {selected?.Toolbar ? (
        <div>
          <p className="px-4 pb-2 text-label-md font-semibold">{selected.displayName}</p>
          <selected.Toolbar />
        </div>
      ) : (
        <p className="px-4 text-label-sm text-on-surface-variant">
          Clique em um componente no canvas para editá-lo.
        </p>
      )}
    </div>
  );
}

/* ─── Toolbar ─── */
function EditorToolbar({ briefingId, segment }: { briefingId: string; segment?: string }) {
  const { actions, query, canUndo, canRedo } = useEditor((state, q) => ({
    canUndo: q.history.canUndo(),
    canRedo: q.history.canRedo(),
  }));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const editorContent = query.serialize();
    try {
      await fetch('/api/admin/save-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefingId, editorContent }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }, [briefingId, query]);

  return (
    <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[color:var(--outline-variant)] bg-surface-low px-4">
      <Link href="/admin/briefings" className="btn-ghost !py-1 text-label-sm">
        <ArrowLeft size={14} /> Briefings
      </Link>
      <div className="h-5 w-px bg-[color:var(--outline-variant)]" />
      <span className="text-label-md font-semibold text-on-surface-variant">
        {segment ? `Editando: ${segment}` : 'Editor de site'}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => actions.history.undo()}
          disabled={!canUndo}
          className="rounded-lg p-1.5 hover:bg-surface disabled:opacity-30"
          title="Desfazer"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={() => actions.history.redo()}
          disabled={!canRedo}
          className="rounded-lg p-1.5 hover:bg-surface disabled:opacity-30"
          title="Refazer"
        >
          <Redo2 size={15} />
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary !py-1.5 text-label-sm disabled:opacity-60"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          {saved ? 'Salvo!' : saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}

/* ─── Canvas Drop Area ─── */
function CanvasArea({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#e8ecef] p-6">
      <div className="mx-auto min-h-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
        {children}
      </div>
    </div>
  );
}

function DefaultFrame() {
  return (
    <Frame>
      <Element is="div" canvas className="min-h-screen">
        <HeroSection />
        <TextBlock content="Adicione mais seções arrastando componentes do painel à esquerda." />
      </Element>
    </Frame>
  );
}

/* ─── Main Export ─── */
export function EditorClient({ briefingId, segment, initialContent }: { briefingId: string; segment?: string; initialContent?: React.ReactElement }) {
  return (
    <Editor resolver={resolver}>
      <div className="flex h-screen flex-col overflow-hidden bg-surface text-on-surface">
        <EditorToolbar briefingId={briefingId} segment={segment} />
        <div className="flex flex-1 overflow-hidden">
          <Toolbox />
          <CanvasArea>
            {initialContent ? <Frame>{initialContent}</Frame> : <DefaultFrame />}
          </CanvasArea>
          <PropertiesPanel />
        </div>
      </div>
    </Editor>
  );
}
