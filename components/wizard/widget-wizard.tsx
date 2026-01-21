'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WidgetPreview } from '@/components/widgets/widget-preview'
import { Check, Copy, Loader2 } from 'lucide-react'
import type { Dictionary, WidgetVariant, TabPosition } from '@/lib/types'

interface WidgetWizardProps {
  dict: Dictionary
  locale: string
}

const COLORS = [
  { name: 'Emerald', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Slate', value: '#475569' },
  { name: 'Zinc', value: '#18181b' },
]

const POSITIONS: { label: string; value: TabPosition }[] = [
  { label: 'Bottom Right', value: 'bottom-right' },
  { label: 'Bottom Left', value: 'bottom-left' },
  { label: 'Bottom Center', value: 'bottom-center' },
  { label: 'Right Middle', value: 'right-middle' },
  { label: 'Left Middle', value: 'left-middle' },
]

export function WidgetWizard({ dict, locale }: WidgetWizardProps) {
  const [step, setStep] = useState(1)
  const [variant, setVariant] = useState<WidgetVariant>('pill')
  const [color, setColor] = useState('#10b981')
  const [size, setSize] = useState<'small' | 'large'>('small')
  const [position, setPosition] = useState<TabPosition>('bottom-right')
  const [siteUrl, setSiteUrl] = useState('')
  const [siteName, setSiteName] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateWidget = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteUrl,
          siteName,
          widgetDefaults: { variant, color, size, position },
        }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to generate widget')
      }
      
      const data = await res.json()
      setToken(data.token)
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const getSnippetCode = () => {
    if (!token) return ''
    
    const appUrl = typeof window !== 'undefined' ? window.location.origin : ''
    
    return `<script>
window._pulsetrack = window._pulsetrack || [];
window._pulsetrack.push(["${variant}", "${token}", "_pulse_${token}", "${color}", "${size}"]);
</script>
<script async src="${appUrl}/d.js"></script>`
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(getSnippetCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`mx-2 h-0.5 w-12 transition-colors ${
                  step > s ? 'bg-primary' : 'bg-secondary'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && dict.wizard.step1}
              {step === 2 && dict.wizard.step2}
              {step === 3 && dict.wizard.step3}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {(['pill', 'badge', 'card', 'floating'] as WidgetVariant[]).map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => setVariant(v)}
                      className={`rounded-lg border p-4 text-left transition-all ${
                        variant === v
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="font-medium capitalize">{dict.wizard.widgetTypes[v]}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {v === 'pill' && 'Popular choice'}
                        {v === 'badge' && 'Minimal design'}
                        {v === 'card' && 'Detailed view'}
                        {v === 'floating' && 'Always visible'}
                      </div>
                    </button>
                  ))}
                </div>
                <Button onClick={() => setStep(2)} className="w-full">
                  Continue
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 block">Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((c) => (
                        <button
                          type="button"
                          key={c.value}
                          onClick={() => setColor(c.value)}
                          className={`h-10 w-10 rounded-lg transition-all ${
                            color === c.value ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                      <Input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-10 w-10 cursor-pointer p-1"
                      />
                    </div>
                  </div>

                  {(variant === 'pill' || variant === 'badge') && (
                    <div>
                      <Label className="mb-3 block">Size</Label>
                      <div className="flex gap-2">
                        {(['small', 'large'] as const).map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setSize(s)}
                            className={`rounded-lg border px-4 py-2 capitalize transition-all ${
                              size === s
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {variant === 'floating' && (
                    <div>
                      <Label className="mb-3 block">Position</Label>
                      <div className="flex flex-wrap gap-2">
                        {POSITIONS.map((p) => (
                          <button
                            type="button"
                            key={p.value}
                            onClick={() => setPosition(p.value)}
                            className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                              position === p.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pt-4">
                    <div>
                      <Label htmlFor="siteUrl">{dict.wizard.siteUrl}</Label>
                      <Input
                        id="siteUrl"
                        type="url"
                        placeholder="https://yoursite.com"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="siteName">{dict.wizard.siteName}</Label>
                      <Input
                        id="siteName"
                        type="text"
                        placeholder="My Website"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={generateWidget} disabled={loading} className="flex-1">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {dict.wizard.generate}
                  </Button>
                </div>
              </>
            )}

            {step === 3 && token && (
              <>
                <div className="space-y-4">
                  <div className="rounded-lg bg-primary/10 p-4 text-center">
                    <div className="text-sm text-muted-foreground">Your widget token</div>
                    <div className="mt-1 font-mono text-lg font-bold text-primary">{token}</div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Embed Code</Label>
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg bg-secondary p-4 text-xs">
                        <code>{getSnippetCode()}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute right-2 top-2"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            {dict.wizard.copied}
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-3 w-3" />
                            {dict.wizard.copyCode}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4 text-sm">
                    <p className="font-medium">How to use:</p>
                    <ol className="mt-2 list-inside list-decimal space-y-1 text-muted-foreground">
                      <li>Copy the code above</li>
                      <li>{"Paste it before the closing </body> tag on your website"}</li>
                      <li>{"The widget will appear automatically"}</li>
                    </ol>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    View your stats at{' '}
                    <a href={`/${locale}/stats/${token}`} className="text-primary hover:underline">
                      /stats/{token}
                    </a>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle>{dict.wizard.preview}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[300px] rounded-lg bg-gradient-to-br from-secondary/50 to-secondary/20 p-6">
              {/* Simulated page */}
              <div className="space-y-3">
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted/60" />
                <div className="h-3 w-4/5 rounded bg-muted/60" />
                <div className="h-3 w-3/5 rounded bg-muted/60" />
              </div>

              {/* Widget preview */}
              <div
                className={`absolute ${
                  variant === 'floating'
                    ? position === 'bottom-right'
                      ? 'bottom-4 right-4'
                      : position === 'bottom-left'
                        ? 'bottom-4 left-4'
                        : position === 'bottom-center'
                          ? 'bottom-4 left-1/2 -translate-x-1/2'
                          : position === 'right-middle'
                            ? 'right-4 top-1/2 -translate-y-1/2'
                            : 'left-4 top-1/2 -translate-y-1/2'
                    : 'bottom-4 right-4'
                }`}
              >
                <WidgetPreview
                  variant={variant}
                  color={color}
                  size={size}
                  position={position}
                  count={42}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
