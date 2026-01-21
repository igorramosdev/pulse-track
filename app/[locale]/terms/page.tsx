import type { Metadata } from 'next'

interface TermsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params
  
  return {
    title: locale === 'pt' ? 'Termos de Uso' : 'Terms of Service',
    description: locale === 'pt' 
      ? 'Termos e condições de uso do PulseTrack.'
      : 'Terms and conditions for using PulseTrack.',
  }
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params
  const isPt = locale === 'pt'

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {isPt ? 'Termos de Uso' : 'Terms of Service'}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {isPt ? 'Última atualização: Janeiro 2026' : 'Last updated: January 2026'}
        </p>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          {isPt ? (
            <>
              <h2>Aceitação dos Termos</h2>
              <p>
                Ao usar o PulseTrack, você concorda com estes termos de uso. 
                Se você não concordar, não use nossos serviços.
              </p>

              <h2>Uso do Serviço</h2>
              <p>Você concorda em:</p>
              <ul>
                <li>Usar o serviço apenas para fins legais</li>
                <li>Não abusar do serviço com spam ou solicitações excessivas</li>
                <li>Não usar o serviço para rastrear usuários sem consentimento</li>
                <li>Não tentar contornar nossos sistemas de segurança</li>
              </ul>

              <h2>Disponibilidade do Serviço</h2>
              <p>
                O PulseTrack é fornecido {"\"como está\""}. Não garantimos disponibilidade 
                100% ou que o serviço estará livre de erros.
              </p>

              <h2>Limitação de Responsabilidade</h2>
              <p>
                Não somos responsáveis por perdas ou danos resultantes do uso 
                ou incapacidade de usar nosso serviço.
              </p>

              <h2>Alterações nos Termos</h2>
              <p>
                Podemos atualizar estes termos a qualquer momento. 
                O uso continuado constitui aceitação dos novos termos.
              </p>
            </>
          ) : (
            <>
              <h2>Acceptance of Terms</h2>
              <p>
                By using PulseTrack, you agree to these terms of service. 
                If you do not agree, please do not use our services.
              </p>

              <h2>Use of Service</h2>
              <p>You agree to:</p>
              <ul>
                <li>Use the service only for lawful purposes</li>
                <li>Not abuse the service with spam or excessive requests</li>
                <li>Not use the service to track users without consent</li>
                <li>Not attempt to circumvent our security systems</li>
              </ul>

              <h2>Service Availability</h2>
              <p>
                PulseTrack is provided {"\"as is\""}. We do not guarantee 100% uptime 
                or that the service will be error-free.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                We are not liable for any losses or damages resulting from your use 
                or inability to use our service.
              </p>

              <h2>Changes to Terms</h2>
              <p>
                We may update these terms at any time. 
                Continued use constitutes acceptance of the new terms.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
