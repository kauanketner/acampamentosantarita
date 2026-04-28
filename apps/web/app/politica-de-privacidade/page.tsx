import { LegalPage } from '@/components/ui/LegalPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Como a comunidade Acampamento Santa Rita coleta, usa e protege seus dados pessoais.',
};

export default function PoliticaPrivacidadePage() {
  return (
    <LegalPage
      eyebrow="Documentos · LGPD"
      title="Política de Privacidade"
      updatedAt="Abril de 2026"
      intro={
        <p>
          A privacidade dos campistas, equipistas e visitantes é coisa séria pra nós. Esta política
          explica, em linguagem clara, o que fazemos com os dados que você nos confia — em
          conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
        </p>
      }
      sections={[
        {
          title: 'Quem é o controlador',
          body: [
            'A Comunidade Acampamento Santa Rita é o controlador dos seus dados pessoais. Atuamos como associação de fiéis vinculada à Paróquia Santa Rita das Cássia, em São Paulo. Para tratar de qualquer assunto relacionado a privacidade, escreva para privacidade@acampamentosantarita.com.br.',
          ],
        },
        {
          title: 'Quais dados coletamos',
          body: [
            'Coletamos os dados que você fornece quando se cadastra no aplicativo, faz uma inscrição em algum evento ou entra em contato pelo site. Tipicamente: nome completo, CPF, data de nascimento, telefone, e-mail, endereço, contato de emergência, informações de saúde relevantes ao acampamento (alergias, restrições alimentares, medicamentos), além de fotos tiradas durante os eventos.',
            'Não coletamos dados sobre orientação sexual, opinião política, filiação a sindicato ou outros dados sensíveis fora do escopo do nosso trabalho.',
          ],
        },
        {
          title: 'Pra que usamos',
          body: [
            'Usamos os dados pra organizar e operar os eventos: aprovar inscrições, montar tribos, providenciar refeições adequadas a restrições alimentares, comunicar mudanças, emitir recibos. Usamos as fotos pra registrar a memória da comunidade, em galerias públicas e em peças de comunicação.',
            'Não vendemos, não cedemos, não compartilhamos seus dados com terceiros pra fins comerciais. Pontos de contato: WhatsApp (Meta), e-mail (provedor de hospedagem), pagamentos (Asaas), armazenamento de imagens (Cloudflare R2). Cada um desses parceiros está sujeito à legislação aplicável.',
          ],
        },
        {
          title: 'Base legal',
          body: [
            'Tratamos seus dados com base no consentimento (no momento da inscrição), na execução de contrato (a relação comunidade-participante) e no legítimo interesse (organização e segurança dos eventos).',
          ],
        },
        {
          title: 'Por quanto tempo guardamos',
          body: [
            'Mantemos os dados de inscrição por até 5 anos após sua última participação, pra fins de histórico e contato eventual. As fotos das galerias podem ser mantidas indefinidamente como memória da comunidade — você pode pedir a retirada da sua imagem a qualquer momento.',
          ],
        },
        {
          title: 'Seus direitos',
          body: [
            'Você tem o direito de: confirmar a existência do tratamento, acessar seus dados, corrigi-los, solicitar a eliminação, pedir portabilidade, retirar o consentimento e se opor a tratamentos que considere indevidos. Pra exercer qualquer desses direitos, escreva para privacidade@acampamentosantarita.com.br — respondemos em até 15 dias.',
          ],
        },
        {
          title: 'Como protegemos',
          body: [
            'Aplicamos medidas técnicas e organizacionais razoáveis pra proteger seus dados: criptografia em trânsito (HTTPS), acesso restrito por funções (apenas coordenação e tesouraria veem dados financeiros), backup regular, e revisão periódica das permissões.',
            'Em caso de incidente de segurança que coloque em risco direitos dos titulares, comunicaremos a ANPD e os titulares afetados em até 72 horas, conforme a lei.',
          ],
        },
        {
          title: 'Crianças e adolescentes',
          body: [
            'Os eventos da comunidade são, em sua maioria, voltados a adultos a partir de 18 anos. Quando incluímos menores (eventos familiares, por exemplo), exigimos autorização expressa dos responsáveis legais e tratamos os dados com cuidado redobrado.',
          ],
        },
        {
          title: 'Atualizações',
          body: [
            'Podemos atualizar esta política conforme nossa prática evolui ou a legislação muda. Sempre que isso acontecer, atualizamos a data no topo desta página e — em caso de mudanças relevantes — comunicamos pelos canais oficiais.',
          ],
        },
      ]}
    />
  );
}
