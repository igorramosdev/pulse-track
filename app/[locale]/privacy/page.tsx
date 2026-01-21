import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import type { Locale } from '@/lib/types'

interface PrivacyPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params
  
  return {
    title: locale === 'pt' ? 'Política de Privacidade' : 'Privacy Policy',
    description: locale === 'pt' 
      ? 'Saiba como o PulseTrack coleta e usa dados de forma responsável.'
      : 'Learn how PulseTrack collects and uses data responsibly.',
  }
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params
  const isPt = locale === 'pt'

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {isPt ? 'Política de Privacidade' : 'Privacy Policy'}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {isPt ? 'Última atualização: Janeiro 2026' : 'Last updated: January 2026'}
        </p>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          {isPt ? (
            <>
              <h2>Visão Geral</h2>
              <p>
                O PulseTrack foi desenvolvido com a privacidade em primeiro lugar. Coletamos apenas 
                os dados mínimos necessários para fornecer estatísticas de visitantes em tempo real.
              </p>

              <h2>Dados que Coletamos</h2>
              <ul>
                <li><strong>ID de Visitante:</strong> Um identificador anônimo gerado aleatoriamente armazenado no navegador do visitante.</li>
                <li><strong>Caminho da Página:</strong> A URL da página sendo visualizada.</li>
                <li><strong>Referenciador:</strong> A página de origem (se disponível).</li>
                <li><strong>Timestamp:</strong> Quando a visita ocorreu.</li>
              </ul>

              <h2>Dados que NÃO Coletamos</h2>
              <ul>
                <li>Endereços IP</li>
                <li>Informações pessoais identificáveis</li>
                <li>Cookies (além do ID de visitante local)</li>
                <li>Dados de rastreamento entre sites</li>
                <li>Impressões digitais do dispositivo</li>
              </ul>

              <h2>Retenção de Dados</h2>
              <p>
                Os dados de presença são automaticamente removidos após 5 minutos de inatividade. 
                Os dados de eventos são mantidos por 30 dias para fins de análise.
              </p>

              <h2>Compartilhamento de Dados</h2>
              <p>
                Não vendemos, alugamos ou compartilhamos seus dados com terceiros. 
                As estatísticas agregadas são visíveis apenas para o proprietário do widget.
              </p>

              <h2>Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco.
              </p>
            </>
          ) : (
            <>
              <h2>Overview</h2>
              <p>
                PulseTrack is built with privacy first. We collect only the minimum data 
                necessary to provide real-time visitor statistics.
              </p>

              <h2>Data We Collect</h2>
              <ul>
                <li><strong>Visitor ID:</strong> A randomly generated anonymous identifier stored in the visitor{"'"}s browser.</li>
                <li><strong>Page Path:</strong> The URL path of the page being viewed.</li>
                <li><strong>Referrer:</strong> The referring page (if available).</li>
                <li><strong>Timestamp:</strong> When the visit occurred.</li>
              </ul>

              <h2>Data We Do NOT Collect</h2>
              <ul>
                <li>IP addresses</li>
                <li>Personally identifiable information</li>
                <li>Cookies (beyond the local visitor ID)</li>
                <li>Cross-site tracking data</li>
                <li>Device fingerprints</li>
              </ul>

              <h2>Data Retention</h2>
              <p>
                Presence data is automatically cleaned up after 5 minutes of inactivity. 
                Event data is retained for 30 days for analytics purposes.
              </p>

              <h2>Data Sharing</h2>
              <p>
                We do not sell, rent, or share your data with third parties. 
                Aggregated statistics are only visible to the widget owner.
              </p>

              <h2>Contact</h2>
              <p>
                If you have questions about this privacy policy, please contact us.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
