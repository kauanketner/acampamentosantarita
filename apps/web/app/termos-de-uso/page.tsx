import { LegalPage } from '@/components/ui/LegalPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description:
    'Termos e condições de uso do site, do aplicativo e da relação com a comunidade Acampamento Santa Rita.',
};

export default function TermosUsoPage() {
  return (
    <LegalPage
      eyebrow="Documentos · Termos"
      title="Termos de Uso"
      updatedAt="Abril de 2026"
      intro={
        <p>
          Estes termos regulam o uso do site <strong>acampamentosantarita.com.br</strong>, do
          aplicativo da comunidade e da participação nos eventos organizados pela Comunidade
          Acampamento Santa Rita. Ao usar nossos serviços, você concorda com eles.
        </p>
      }
      sections={[
        {
          title: 'Sobre a comunidade',
          body: [
            'A Comunidade Acampamento Santa Rita é uma associação de fiéis sem fins lucrativos, vinculada à Paróquia Santa Rita das Cássia, em São Paulo. Organiza acampamentos, retiros, encontros e formações de cunho espiritual, sob orientação eclesial.',
          ],
        },
        {
          title: 'Cadastro e conta',
          body: [
            'Pra usar o aplicativo e se inscrever em eventos, você precisa criar uma conta. Você é responsável por manter os dados atualizados e pela confidencialidade do seu acesso (código por SMS/WhatsApp). Não compartilhe seu código com ninguém.',
            'Reservamos o direito de suspender ou encerrar contas que violem estes termos, prejudiquem outros membros ou comprometam o funcionamento da comunidade.',
          ],
        },
        {
          title: 'Inscrições em eventos',
          body: [
            'Toda inscrição passa por aprovação manual da coordenação. Não somos obrigados a aceitar todas as inscrições — eventualmente recusamos por motivos de adequação ao perfil do evento, capacidade ou histórico de comportamento. Em todos os casos, comunicamos a decisão.',
            'O pagamento é condição pra confirmação da vaga. Cancelamentos seguem a política da página de cada evento (regra geral: 90% até 30 dias antes; 50% até 15 dias antes; depois disso, fica como crédito).',
          ],
        },
        {
          title: 'Conduta nos eventos',
          body: [
            'Esperamos respeito mútuo, escuta, sobriedade e cuidado com o espaço. Não toleramos qualquer forma de violência, discriminação ou comportamento que comprometa o ambiente espiritual e de comunhão.',
            'A coordenação pode, a qualquer momento, pedir a retirada de quem não respeitar essas premissas — sem reembolso, em casos graves.',
          ],
        },
        {
          title: 'Imagem e voz',
          body: [
            'Durante os eventos, registramos fotos e vídeos pra memória da comunidade e comunicação. Ao se inscrever, você autoriza o uso da sua imagem em peças oficiais (site, redes, materiais impressos) — sem qualquer obrigação financeira de nossa parte e sem prazo determinado.',
            'Você pode, a qualquer momento, solicitar a remoção da sua imagem de materiais específicos. Faremos o possível pra atender.',
          ],
        },
        {
          title: 'Pagamentos e doações',
          body: [
            'Os pagamentos são processados pelo Asaas. As doações feitas pela lojinha ou pelos canais oficiais são revertidas integralmente pras atividades da comunidade — bolsas, manutenção, missões. Emitimos recibos quando solicitado.',
          ],
        },
        {
          title: 'Propriedade intelectual',
          body: [
            'O nome "Acampamento Santa Rita", a logomarca, os textos do site e do aplicativo, as canções compostas pela comunidade e os materiais formativos são propriedade da Comunidade Acampamento Santa Rita ou licenciados a ela.',
            'Você pode citar e compartilhar nossos materiais com indicação da fonte. Pra usos comerciais ou em larga escala, fale com a coordenação antes.',
          ],
        },
        {
          title: 'Limitação de responsabilidade',
          body: [
            'Fazemos o possível pra que site e app funcionem bem, mas não garantimos disponibilidade ininterrupta. Não nos responsabilizamos por danos indiretos decorrentes do uso dos serviços.',
            'Eventos físicos têm riscos inerentes (transporte, atividades ao ar livre etc.). Cobrimos com seguro quando aplicável e aplicamos protocolos de segurança razoáveis. A participação é voluntária e por sua conta e risco.',
          ],
        },
        {
          title: 'Foro',
          body: [
            'Estes termos são regidos pelas leis brasileiras. Eventuais disputas serão resolvidas no foro da comarca de São Paulo, SP, com renúncia a qualquer outro, por mais privilegiado que seja.',
          ],
        },
        {
          title: 'Contato',
          body: [
            'Qualquer dúvida sobre estes termos: contato@acampamentosantarita.com.br ou pelo WhatsApp da coordenação.',
          ],
        },
      ]}
    />
  );
}
