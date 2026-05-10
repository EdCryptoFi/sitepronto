'use client';

import { useState } from 'react';
import { Settings, CreditCard, Percent, FileText, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function ConfiguracoesPage() {
  const [mpPublicKey, setMpPublicKey] = useState('');
  const [mpAccessToken, setMpAccessToken] = useState('');
  const [sitePrice, setSitePrice] = useState('300');
  const [commission, setCommission] = useState('30');
  const [termos, setTermos] = useState('');
  const [privacidade, setPrivacidade] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  const handleSave = (section: string) => {
    // In production: POST to /api/admin/settings
    setSaved(section);
    setTimeout(() => setSaved(null), 3000);
  };

  return (
    <div className="min-h-screen bg-surface lg:pl-64">
      <AdminSidebar />

      <div className="pb-20 pt-6 lg:pb-6">
        <div className="px-6">
          <h1 className="text-headline-sm font-bold">Configurações da Plataforma</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Gerencie integrações de pagamento, precificação e documentos legais.
          </p>
        </div>

        <div className="mt-8 space-y-6 px-6">
          {/* MercadoPago */}
          <div className="card">
            <div className="mb-5 flex items-center gap-3">
              <span className="icon-halo"><CreditCard size={18} /></span>
              <div>
                <h2 className="text-title-md font-bold">Integração Mercado Pago</h2>
                <p className="text-label-sm text-on-surface-variant">Configure as chaves de API para processar pagamentos.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-label-md font-semibold">Public Key</label>
                <input
                  type="text"
                  value={mpPublicKey}
                  onChange={(e) => setMpPublicKey(e.target.value)}
                  className="field"
                  placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-label-md font-semibold">Access Token</label>
                <input
                  type="password"
                  value={mpAccessToken}
                  onChange={(e) => setMpAccessToken(e.target.value)}
                  className="field"
                  placeholder="APP_USR-XXXXXXXXXXXXXXXXXXXXXXXX"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave('mp')}
                className="btn-primary"
              >
                <Save size={15} /> Salvar Chaves API
              </button>
              {saved === 'mp' && (
                <span className="flex items-center gap-1 text-label-sm text-green-600">
                  <CheckCircle2 size={14} /> Salvo!
                </span>
              )}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-yellow-50 p-3 text-yellow-800">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <p className="text-label-sm">
                As chaves estão configuradas no <code>.env.local</code> como <code>MP_ACCESS_TOKEN</code>. Altere diretamente no arquivo para efeito imediato em produção.
              </p>
            </div>
          </div>

          {/* Pricing & Commission */}
          <div className="card">
            <div className="mb-5 flex items-center gap-3">
              <span className="icon-halo"><Percent size={18} /></span>
              <div>
                <h2 className="text-title-md font-bold">Valores e Comissões</h2>
                <p className="text-label-sm text-on-surface-variant">Defina o preço do site e a comissão dos afiliados.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-label-md font-semibold">Preço do Site (R$)</label>
                <input
                  type="number"
                  value={sitePrice}
                  onChange={(e) => setSitePrice(e.target.value)}
                  className="field"
                  min="1"
                  step="1"
                />
                <p className="mt-1 text-label-sm text-on-surface-variant">Valor final cobrado do cliente.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-label-md font-semibold">Comissão de Afiliado (%)</label>
                <input
                  type="number"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  className="field"
                  min="1"
                  max="90"
                  step="1"
                />
                <p className="mt-1 text-label-sm text-on-surface-variant">% por cada venda indicada.</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-primary/5 p-3 text-body-sm">
              <strong>Dica:</strong> Uma comissão entre 25% e 35% é o sweet spot para atrair afiliados de alta performance.
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button type="button" onClick={() => handleSave('pricing')} className="btn-primary">
                <Save size={15} /> Atualizar Parâmetros
              </button>
              {saved === 'pricing' && (
                <span className="flex items-center gap-1 text-label-sm text-green-600">
                  <CheckCircle2 size={14} /> Salvo!
                </span>
              )}
            </div>
          </div>

          {/* Legal Documents */}
          <div className="card">
            <div className="mb-5 flex items-center gap-3">
              <span className="icon-halo"><FileText size={18} /></span>
              <div>
                <h2 className="text-title-md font-bold">Documentos Legais</h2>
                <p className="text-label-sm text-on-surface-variant">Termos de uso e política de privacidade exibidos no quiz.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-label-md font-semibold">Termos de Uso</label>
                <textarea
                  value={termos}
                  onChange={(e) => setTermos(e.target.value)}
                  className="field min-h-48 resize-y"
                  placeholder="A SitePronto provê serviços de criação automatizada de sites..."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-label-md font-semibold">Política de Privacidade</label>
                <textarea
                  value={privacidade}
                  onChange={(e) => setPrivacidade(e.target.value)}
                  className="field min-h-48 resize-y"
                  placeholder="Nós respeitamos a privacidade dos seus dados pessoais..."
                />
              </div>
            </div>

            <p className="mt-3 text-label-sm text-on-surface-variant">
              Ao salvar, os novos termos serão exibidos no próximo acesso dos usuários.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button type="button" onClick={() => handleSave('legal')} className="btn-primary">
                <Save size={15} /> Publicar Alterações Legais
              </button>
              {saved === 'legal' && (
                <span className="flex items-center gap-1 text-label-sm text-green-600">
                  <CheckCircle2 size={14} /> Salvo!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
