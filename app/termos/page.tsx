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
          <p className="mt-3">
            O valor de <strong>R$ 300,00 (trezentos reais)</strong> cobre exclusivamente:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Criação e publicação do site profissional;</li>
            <li>Hospedagem por <strong>12 (doze) meses</strong> após a publicação;</li>
            <li>Certificado de segurança HTTPS;</li>
            <li>Suporte por 30 dias após a entrega.</li>
          </ul>
          <p className="mt-3">
            <strong>O registro ou renovação de domínio não está incluso neste valor</strong> e deve
            ser adquirido e pago diretamente pelo Cliente junto ao registrador de sua escolha
            (ex.: Registro.br, GoDaddy, Hostinger). O SitePronto pode auxiliar no processo de
            configuração mediante solicitação, sem custo adicional.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. Domínio</h2>
          <p>
            O domínio é registrado <strong>exclusivamente em nome do Cliente</strong> (CPF ou CNPJ
            informado) e permanece de propriedade do Cliente independentemente da continuidade do
            serviço SitePronto.
          </p>
          <p className="mt-3">
            O custo de registro do domínio .com.br é de aproximadamente <strong>R$ 40,00/ano</strong>,
            pago diretamente pelo Cliente ao registrador (ex.: Registro.br). Esse valor é de
            <strong> responsabilidade integral do Cliente</strong> e não faz parte do escopo contratado. O SitePronto não se responsabiliza
            pela expiração do domínio por falta de renovação.
          </p>
          <p className="mt-3">
            Clientes que já possuem domínio registrado podem utilizá-lo sem custo adicional,
            devendo informar no briefing a opção "já tenho um domínio".
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Hospedagem e Renovação</h2>
          <p>
            A hospedagem está inclusa no valor único de <strong>R$ 300,00</strong> e cobre um período
            de <strong>12 (doze) meses</strong> a partir da data de publicação oficial do site no
            domínio do Cliente.
          </p>
          <p className="mt-3">
            Após o término do período de 12 meses, a continuidade da hospedagem está sujeita à
            renovação do serviço no valor de <strong>R$ 300,00 (trezentos reais)</strong>, a ser
            contratada pelo Cliente junto ao SitePronto. O SitePronto entrará em contato com
            antecedência mínima de 30 dias antes do vencimento.
          </p>
          <p className="mt-3">
            A não renovação dentro do prazo pode resultar na suspensão temporária do site até
            que o pagamento seja efetuado. O SitePronto não se responsabiliza por eventuais perdas
            decorrentes da suspensão por falta de renovação.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Aprovação do Layout e Revisões</h2>
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
          <h2 className="text-xl font-bold mb-3">6. Responsabilidades do Cliente</h2>
          <p>O Cliente é responsável por:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Fornecer informações verídicas e conteúdo de sua titularidade no briefing;</li>
            <li>Garantir que imagens, textos e marcas enviados não violam direitos de terceiros;</li>
            <li>Registrar e renovar o domínio junto ao registrador de sua escolha;</li>
            <li>Renovar o serviço de hospedagem dentro do prazo de vencimento de 12 meses.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. Garantia de Satisfação</h2>
          <p>
            O Cliente dispõe de <strong>7 (sete) dias corridos</strong> a partir da entrega do site
            para solicitar reembolso integral, caso o resultado final não corresponda ao briefing
            aprovado. Solicitações realizadas após esse prazo ou com base em preferências estéticas
            subjetivas não diferentes do briefing não são elegíveis ao reembolso.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">8. Limitação de Responsabilidade</h2>
          <p>
            O SitePronto não se responsabiliza por eventuais perdas de receita, perda de dados
            ou danos indiretos decorrentes de falhas de terceiros (provedores de DNS, registradores
            de domínio, processadores de pagamento). Em caso de indisponibilidade do serviço,
            o SitePronto envidará esforços razoáveis para restabelecer o funcionamento no menor
            prazo possível.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">9. Alterações dos Termos</h2>
          <p>
            O SitePronto reserva-se o direito de alterar estes Termos a qualquer momento,
            com publicação da versão atualizada nesta página. O uso continuado do serviço
            após a publicação implica aceitação das alterações.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">10. Foro</h2>
          <p>
            Fica eleito o foro da comarca de Campinas/SP para dirimir quaisquer
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
