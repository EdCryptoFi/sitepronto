import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade — SitePronto',
  description: 'Como o SitePronto coleta, usa e protege seus dados pessoais.',
};

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Política de Privacidade</h1>
      <p className="mb-12 text-sm text-on-surface-variant">Última atualização: maio de 2026</p>

      <div className="prose prose-neutral max-w-none space-y-10 text-on-surface">

        <section>
          <h2 className="text-xl font-bold mb-3">1. Quem somos</h2>
          <p>
            SitePronto é um serviço de criação de sites profissionais para pequenas empresas
            brasileiras, operado por pessoa jurídica com sede no Brasil. Para dúvidas sobre
            privacidade, entre em contato pelo e-mail{' '}
            <a href="mailto:contato@siteprontobr.xyz" className="text-primary underline">
              contato@siteprontobr.xyz
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. Dados que coletamos</h2>
          <p>Coletamos apenas os dados necessários para prestar o serviço:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li><strong>Dados de contato:</strong> nome, e-mail e número de WhatsApp informados no formulário de pedido;</li>
            <li><strong>Dados do negócio:</strong> nome da empresa, descrição, logotipo, horário de funcionamento e portfólio fornecidos no briefing;</li>
            <li><strong>Dados de domínio:</strong> nome de domínio desejado e CPF/CNPJ para registro;</li>
            <li><strong>Dados de pagamento:</strong> processados integralmente pelo Mercado Pago — o SitePronto não armazena dados de cartão;</li>
            <li><strong>Dados de uso:</strong> logs de acesso ao painel e ao site gerado, para fins de segurança e melhoria do serviço.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. Como usamos seus dados</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Criar e publicar o site contratado;</li>
            <li>Registrar o domínio no nome do Cliente;</li>
            <li>Enviar confirmações de pedido e notificações de entrega por e-mail;</li>
            <li>Prestar suporte técnico;</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
          <p className="mt-3">Não utilizamos seus dados para envio de publicidade de terceiros nem os vendemos a nenhuma empresa.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Compartilhamento de dados</h2>
          <p>Seus dados podem ser compartilhados somente com:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li><strong>Mercado Pago</strong> — processamento de pagamentos;</li>
            <li><strong>Registro.br / registradores de domínio</strong> — registro do domínio em seu nome;</li>
            <li><strong>Provedores de infraestrutura</strong> (Supabase, Vercel) — armazenamento e hospedagem do serviço, todos com sede ou conformidade com legislação de proteção de dados;</li>
            <li><strong>Autoridades competentes</strong> — quando exigido por lei ou ordem judicial.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Base legal (LGPD)</h2>
          <p>O tratamento dos dados é fundamentado nas seguintes bases legais previstas na Lei nº 13.709/2018 (LGPD):</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li><strong>Execução de contrato</strong> — para entrega do serviço contratado;</li>
            <li><strong>Obrigação legal</strong> — para cumprimento de exigências fiscais e legais;</li>
            <li><strong>Legítimo interesse</strong> — para segurança, prevenção a fraudes e melhoria do serviço;</li>
            <li><strong>Consentimento</strong> — quando aplicável, coletado expressamente no formulário.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. Retenção dos dados</h2>
          <p>
            Os dados são mantidos pelo prazo necessário à execução do contrato e ao cumprimento
            de obrigações legais (mínimo de 5 anos para registros fiscais). Dados de briefing
            e portfólio podem ser excluídos a pedido do Cliente após a entrega do site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. Seus direitos</h2>
          <p>Nos termos da LGPD, você pode, a qualquer momento:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Confirmar a existência de tratamento dos seus dados;</li>
            <li>Acessar os dados que temos sobre você;</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>Revogar o consentimento, quando aplicável.</li>
          </ul>
          <p className="mt-3">
            Para exercer seus direitos, envie e-mail para{' '}
            <a href="mailto:contato@siteprontobr.xyz" className="text-primary underline">
              contato@siteprontobr.xyz
            </a>{' '}
            com o assunto "LGPD — Solicitação de Titular".
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">8. Cookies</h2>
          <p>
            O site utiliza cookies essenciais para funcionamento (sessão, preferência de tema).
            Não utilizamos cookies de rastreamento publicitário de terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">9. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra
            acesso não autorizado, perda ou destruição, incluindo criptografia em trânsito (HTTPS/TLS)
            e controle de acesso restrito ao banco de dados.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">10. Alterações desta Política</h2>
          <p>
            Podemos atualizar esta Política periodicamente. A versão mais recente estará sempre
            disponível nesta página com a data de atualização indicada no topo.
          </p>
        </section>

      </div>

      <div className="mt-16 border-t pt-8 text-sm text-on-surface-variant">
        <p>Dúvidas? Entre em contato: <a href="mailto:contato@siteprontobr.xyz" className="text-primary underline">contato@siteprontobr.xyz</a></p>
      </div>
    </main>
  );
}
