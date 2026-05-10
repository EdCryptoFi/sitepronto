'use client';

import { useNode } from '@craftjs/core';
import type { ReactNode } from 'react';

/* ─── Shared Settings Wrapper ─── */
function SettingsPanel({ children }: { children: ReactNode }) {
  return <div className="space-y-3 p-3">{children}</div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg bg-surface px-2 py-1.5 text-body-sm ring-1 ring-[color:var(--outline-variant)] focus:outline-none focus:ring-primary';

/* ─── HeroSection ─── */
type HeroProps = {
  title?: string;
  subtitle?: string;
  cta?: string;
  bgColor?: string;
  textColor?: string;
};

export function HeroSection({
  title = 'Título principal',
  subtitle = 'Uma frase que explica o que você oferece.',
  cta = 'Saiba mais',
  bgColor = '#004ac6',
  textColor = '#ffffff',
}: HeroProps) {
  const { connectors: { connect, drag } } = useNode();
  return (
    <section
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{ backgroundColor: bgColor, color: textColor }}
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <h1 className="max-w-2xl text-4xl font-bold leading-tight">{title}</h1>
      <p className="max-w-xl text-lg opacity-80">{subtitle}</p>
      <button
        className="mt-2 rounded-xl px-6 py-3 text-base font-semibold"
        style={{ backgroundColor: textColor, color: bgColor }}
      >
        {cta}
      </button>
    </section>
  );
}

function HeroSettings() {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props as HeroProps }));
  return (
    <SettingsPanel>
      <Field label="Título">
        <input className={inputCls} value={props.title} onChange={(e) => setProp((p: HeroProps) => (p.title = e.target.value))} />
      </Field>
      <Field label="Subtítulo">
        <textarea className={inputCls} rows={2} value={props.subtitle} onChange={(e) => setProp((p: HeroProps) => (p.subtitle = e.target.value))} />
      </Field>
      <Field label="Texto do botão">
        <input className={inputCls} value={props.cta} onChange={(e) => setProp((p: HeroProps) => (p.cta = e.target.value))} />
      </Field>
      <Field label="Cor de fundo">
        <input type="color" value={props.bgColor} onChange={(e) => setProp((p: HeroProps) => (p.bgColor = e.target.value))} className="h-8 w-full cursor-pointer rounded-lg" />
      </Field>
      <Field label="Cor do texto">
        <input type="color" value={props.textColor} onChange={(e) => setProp((p: HeroProps) => (p.textColor = e.target.value))} className="h-8 w-full cursor-pointer rounded-lg" />
      </Field>
    </SettingsPanel>
  );
}

HeroSection.craft = {
  displayName: 'Hero',
  props: { title: 'Título principal', subtitle: 'Subtítulo da seção', cta: 'Saiba mais', bgColor: '#004ac6', textColor: '#ffffff' },
  related: { toolbar: HeroSettings },
};

/* ─── TextBlock ─── */
type TextProps = { content?: string; fontSize?: string; align?: string; color?: string };

export function TextBlock({
  content = 'Escreva um parágrafo aqui.',
  fontSize = '16px',
  align = 'left',
  color = '#191c1e',
}: TextProps) {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="px-8 py-6"
      style={{ fontSize, textAlign: align as 'left' | 'center' | 'right', color }}
    >
      <p className="max-w-3xl">{content}</p>
    </div>
  );
}

function TextSettings() {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props as TextProps }));
  return (
    <SettingsPanel>
      <Field label="Conteúdo">
        <textarea className={inputCls} rows={4} value={props.content} onChange={(e) => setProp((p: TextProps) => (p.content = e.target.value))} />
      </Field>
      <Field label="Tamanho da fonte">
        <select className={inputCls} value={props.fontSize} onChange={(e) => setProp((p: TextProps) => (p.fontSize = e.target.value))}>
          <option value="14px">Pequeno</option>
          <option value="16px">Normal</option>
          <option value="20px">Grande</option>
          <option value="24px">Extra grande</option>
        </select>
      </Field>
      <Field label="Alinhamento">
        <select className={inputCls} value={props.align} onChange={(e) => setProp((p: TextProps) => (p.align = e.target.value))}>
          <option value="left">Esquerda</option>
          <option value="center">Centro</option>
          <option value="right">Direita</option>
        </select>
      </Field>
      <Field label="Cor do texto">
        <input type="color" value={props.color} onChange={(e) => setProp((p: TextProps) => (p.color = e.target.value))} className="h-8 w-full cursor-pointer rounded-lg" />
      </Field>
    </SettingsPanel>
  );
}

TextBlock.craft = {
  displayName: 'Texto',
  props: { content: 'Escreva um parágrafo aqui.', fontSize: '16px', align: 'left', color: '#191c1e' },
  related: { toolbar: TextSettings },
};

/* ─── ImageBlock ─── */
type ImageProps = { src?: string; alt?: string; caption?: string };

export function ImageBlock({
  src = '',
  alt = 'Imagem',
  caption = '',
}: ImageProps) {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} className="px-8 py-6">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="w-full rounded-2xl object-cover" />
      ) : (
        <div className="flex h-48 items-center justify-center rounded-2xl bg-surface-low text-on-surface-variant">
          Nenhuma imagem — insira uma URL abaixo
        </div>
      )}
      {caption && <p className="mt-2 text-center text-sm text-on-surface-variant">{caption}</p>}
    </div>
  );
}

function ImageSettings() {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props as ImageProps }));
  return (
    <SettingsPanel>
      <Field label="URL da imagem">
        <input className={inputCls} placeholder="https://..." value={props.src} onChange={(e) => setProp((p: ImageProps) => (p.src = e.target.value))} />
      </Field>
      <Field label="Texto alternativo">
        <input className={inputCls} value={props.alt} onChange={(e) => setProp((p: ImageProps) => (p.alt = e.target.value))} />
      </Field>
      <Field label="Legenda">
        <input className={inputCls} value={props.caption} onChange={(e) => setProp((p: ImageProps) => (p.caption = e.target.value))} />
      </Field>
    </SettingsPanel>
  );
}

ImageBlock.craft = {
  displayName: 'Imagem',
  props: { src: '', alt: 'Imagem', caption: '' },
  related: { toolbar: ImageSettings },
};

/* ─── ContactForm ─── */
type ContactProps = { title?: string; bgColor?: string };

export function ContactForm({ title = 'Fale conosco', bgColor = '#f7f9fb' }: ContactProps) {
  const { connectors: { connect, drag } } = useNode();
  return (
    <section
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{ backgroundColor: bgColor }}
      className="px-8 py-12"
    >
      <h2 className="mb-6 text-center text-2xl font-bold">{title}</h2>
      <div className="mx-auto max-w-lg space-y-3">
        <input disabled className="w-full rounded-xl bg-white px-4 py-3 ring-1 ring-gray-200" placeholder="Seu nome" />
        <input disabled className="w-full rounded-xl bg-white px-4 py-3 ring-1 ring-gray-200" placeholder="Seu e-mail" />
        <textarea disabled className="w-full rounded-xl bg-white px-4 py-3 ring-1 ring-gray-200" rows={4} placeholder="Sua mensagem" />
        <button disabled className="w-full rounded-xl bg-primary py-3 font-semibold text-white">Enviar</button>
      </div>
    </section>
  );
}

function ContactSettings() {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props as ContactProps }));
  return (
    <SettingsPanel>
      <Field label="Título da seção">
        <input className={inputCls} value={props.title} onChange={(e) => setProp((p: ContactProps) => (p.title = e.target.value))} />
      </Field>
      <Field label="Cor de fundo">
        <input type="color" value={props.bgColor} onChange={(e) => setProp((p: ContactProps) => (p.bgColor = e.target.value))} className="h-8 w-full cursor-pointer rounded-lg" />
      </Field>
    </SettingsPanel>
  );
}

ContactForm.craft = {
  displayName: 'Formulário de contato',
  props: { title: 'Fale conosco', bgColor: '#f7f9fb' },
  related: { toolbar: ContactSettings },
};
