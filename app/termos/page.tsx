import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso — SitePronto',
  description: 'Termos e condições de uso do serviço SitePronto.',
};

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Termos de Uso</h1>
      <p className="mb-12 text-sm text-on-surface-variant">Última atualização: maio de 2026</p>

      <div className="prose prose-neutral max-w-none space-y-10 text-on-surface">

        <section>
          <h2 className="text-xl font-bold mb-3">1. Aceitação dos Termos</h2>
          <p>
            Ao preencher o formulário de pedido e realizar o pagamento, o Cliente declara ter lido,
            compreendido e aceito integralmente estes Termos de Uso. A contratação implica
            concordância com todas as condições aqui descritas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. Serviço Contratado</h2>
          <p>
            O SitePronto entrega um site profissional configurado com base nas informações fornecidas
            pelo Cliente no momento do pedido (briefing), incluindo template selecionado, módulos,
            paleta de cores, textos e imagens indicados.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. Aprovação do Layout e Não Aceitação de Devoluções</h2>
          <p>
            Após a entrega do layout final para revisão, o Cliente tem o prazo indicado no e-mail de
            entrega para solicitar ajustes pontuais de texto e imagens.
          </p>
          <p className="mt-3">
            <strong>A aprovação do pedido — e o consequente pagamento — equivale à aceitação
            expressa do formato de layout entregue.</strong> Uma vez aprovado o layout final pelo
            Cliente (por ação afirmativa ou pelo decurso do prazo de revisão sem manifestação),
            não serão aceitas solicitações de devolução do valor pago com base na estrutura ou
            diagramação do site.
          </p>
          <p className="mt-3">
            Edições posteriores ao layout aprovado, alterações na diagramação, mudança de template
            ou adição de novos módulos estão fora do escopo do serviço contratado e
            <strong> terão custos adicionais</strong>, a serem orçados caso a caso.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Domínio</h2>
          <p>
            Quando incluso no pacote, o domínio é registrado em nome do Cliente (CPF ou CNPJ
            informado) e permanece de propriedade do Cliente independentemente da continuidade
            do serviço SitePronto.
          </p>
          <p className="mt-3">
            O domínio possui vigência de <strong>12 (doze) meses</strong> a partir do registro.
            Após esse período, a renovação é de responsabilidade exclusiva do Cliente e pode
            estar sujeita a <strong>taxas de renovação cobradas pela autoridade registradora</strong>
            (atualmente em torno de R$ 40/ano para domínios .com.br). O SitePronto não se responsabiliza
            pela expiração do domínio por falta de renovação.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Hospedagem</h2>
          <p>
            A hospedagem está inclusa no valor único do serviço e não possui cobrança mensal de
            servidor durante o período contratado. O Cliente é responsável pela renovação anual
            do domínio conforme descrito na cláusula 4.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. Responsabilidades do Cliente</h2>
          <p>O Cliente é responsável por:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Fornecer informações verídicas e conteúdo de sua titularidade no briefing;</li>
            <li>Garantir que imagens, textos e marcas enviados não violam direitos de terceiros;</li>
            <li>Manter os dados de acesso ao painel em sigilo;</li>
            <li>Renovar o domínio dentro do prazo de vencimento.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. Limitação de Responsabilidade</h2>
          <p>
            O SitePronto não se responsabiliza por eventuais perdas de receita, perda de dados
            ou danos indiretos decorrentes de falhas de terceiros (provedores de DNS, registradores
            de domínio, processadores de pagamento). Em caso de indisponibilidade do serviço,
            o SitePronto envidará esforços razoáveis para restabelecer o funcionamento no menor
            prazo possível.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">8. Alterações dos Termos</h2>
          <p>
            O SitePronto reserva-se o direito de alterar estes Termos a qualquer momento,
            com publicação da versão atualizada nesta página. O uso continuado do serviço
            após a publicação implica aceitação das alterações.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">9. Foro</h2>
          <p>
            Fica eleito o foro da comarca de domicílio do Cliente para dirimir quaisquer
            controvérsias decorrentes destes Termos, com renúncia a qualquer outro, por mais
            privilegiado que seja.
          </p>
        </section>
      </div>

      <div className="mt-16 border-t pt-8 text-sm text-on-surface-variant">
        <p>Dúvidas? Entre em contato: <a href="mailto:contato@siteprontobr.xyz" className="text-primary underline">contato@siteprontobr.xyz</a></p>
      </div>
    </main>
  );
}
