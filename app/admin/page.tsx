'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Activity,
  AlertTriangle,
  Ban,
  CheckCircle,
  Key,
  Loader2,
  RefreshCw,
  Shield,
  Trash2,
  Users,
  Zap,
} from 'lucide-react'

interface Token {
  id: string
  token: string
  created_at: string
  is_blocked: boolean
  site_url?: string
  site_name?: string
  online_count: number
  events_24h: number
}

interface AdminStats {
  totalTokens: number
  blockedTokens: number
  activeTokens: number
  events24h: number
  eventsLastHour: number
  totalOnline: number
  topTokens: { token: string; event_count: number }[]
  potentialAbuse: { token: string; event_count: number }[]
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminKey}`,
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', { headers })
      if (!res.ok) throw new Error('Failed to fetch stats')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Stats fetch error:', err)
    }
  }

  const fetchTokens = async (pageNum: number = 1) => {
    try {
      const res = await fetch(`/api/admin/tokens?page=${pageNum}&limit=20`, { headers })
      if (!res.ok) throw new Error('Failed to fetch tokens')
      const data = await res.json()
      setTokens(data.tokens)
      setTotalPages(data.totalPages)
      setPage(data.page)
    } catch (err) {
      console.error('Tokens fetch error:', err)
    }
  }

  const authenticate = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminKey}` },
      })
      
      if (res.status === 401) {
        setError('Invalid admin key')
        return
      }
      
      if (!res.ok) {
        setError('Authentication failed')
        return
      }
      
      setIsAuthenticated(true)
      const data = await res.json()
      setStats(data)
      await fetchTokens()
    } catch (err) {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  const toggleBlock = async (token: string, currentlyBlocked: boolean) => {
    try {
      const res = await fetch('/api/admin/tokens', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ token, is_blocked: !currentlyBlocked }),
      })
      
      if (!res.ok) throw new Error('Failed to update token')
      
      setTokens(tokens.map(t => 
        t.token === token ? { ...t, is_blocked: !currentlyBlocked } : t
      ))
    } catch (err) {
      console.error('Toggle block error:', err)
    }
  }

  const deleteToken = async (token: string) => {
    if (!confirm(`Are you sure you want to delete token "${token}"? This cannot be undone.`)) {
      return
    }
    
    try {
      const res = await fetch(`/api/admin/tokens?token=${token}`, {
        method: 'DELETE',
        headers,
      })
      
      if (!res.ok) throw new Error('Failed to delete token')
      
      setTokens(tokens.filter(t => t.token !== token))
      await fetchStats()
    } catch (err) {
      console.error('Delete token error:', err)
    }
  }

  const refresh = async () => {
    setLoading(true)
    await Promise.all([fetchStats(), fetchTokens(page)])
    setLoading(false)
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return
    
    const interval = setInterval(refresh, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated, page])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="adminKey">Admin Key</Label>
              <div className="relative mt-1.5">
                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="adminKey"
                  type="password"
                  placeholder="Enter your admin key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && authenticate()}
                  className="pl-10"
                />
              </div>
            </div>
            
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            
            <Button onClick={authenticate} disabled={loading || !adminKey} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Authenticate
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">PulseTrack Admin</h1>
              <p className="text-xs text-muted-foreground">Manage tokens and monitor usage</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalOnline}</div>
                  <div className="text-xs text-muted-foreground">Online Now</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-chart-2/10 p-2">
                  <Users className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.activeTokens}</div>
                  <div className="text-xs text-muted-foreground">Active Tokens</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-chart-3/10 p-2">
                  <Zap className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.events24h.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Events (24h)</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-destructive/10 p-2">
                  <Ban className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.blockedTokens}</div>
                  <div className="text-xs text-muted-foreground">Blocked</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Abuse Alerts */}
        {stats && stats.potentialAbuse.length > 0 && (
          <Card className="mb-8 border-amber-500/20 bg-amber-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
                Potential Abuse Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.potentialAbuse.map(item => (
                  <div key={item.token} className="flex items-center justify-between rounded-lg bg-background p-3">
                    <span className="font-mono text-sm">{item.token}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.event_count.toLocaleString()} events/24h
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tokens List */}
        <Card>
          <CardHeader>
            <CardTitle>Tokens ({tokens.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tokens.map(token => (
                <div
                  key={token.id}
                  className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
                    token.is_blocked ? 'border-destructive/30 bg-destructive/5' : 'border-border'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{token.token}</span>
                      {token.is_blocked && (
                        <span className="rounded bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                          Blocked
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {token.site_name && <span>{token.site_name}</span>}
                      {token.site_url && <span>{token.site_url}</span>}
                      <span>Created: {new Date(token.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-primary">{token.online_count}</div>
                        <div className="text-xs text-muted-foreground">online</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{token.events_24h}</div>
                        <div className="text-xs text-muted-foreground">24h</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBlock(token.token, token.is_blocked)}
                      >
                        {token.is_blocked ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban className="mr-1 h-3 w-3" />
                            Block
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteToken(token.token)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchTokens(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchTokens(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
