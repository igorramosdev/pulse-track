import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminKey = process.env.ADMIN_KEY
  
  if (!adminKey) return false
  return authHeader === `Bearer ${adminKey}`
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseAdminClient()

    // Get total tokens
    const { count: totalTokens } = await supabase
      .from('tokens')
      .select('*', { count: 'exact', head: true })

    // Get blocked tokens
    const { count: blockedTokens } = await supabase
      .from('tokens')
      .select('*', { count: 'exact', head: true })
      .eq('is_blocked', true)

    // Get total events in last 24h
    const { count: events24h } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    // Get total events in last hour
    const { count: eventsLastHour } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())

    // Get current online count (all tokens)
    const { count: totalOnline } = await supabase
      .from('presence')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen_at', new Date(Date.now() - 45 * 1000).toISOString())

    // Get top tokens by activity (last 24h)
    const { data: topTokens } = await supabase
      .from('events')
      .select('token')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    // Count events per token
    const tokenCounts: Record<string, number> = {}
    topTokens?.forEach(event => {
      tokenCounts[event.token] = (tokenCounts[event.token] || 0) + 1
    })

    const topTokensArray = Object.entries(tokenCounts)
      .map(([token, count]) => ({ token, event_count: count }))
      .sort((a, b) => b.event_count - a.event_count)
      .slice(0, 10)

    // Detect potential abuse (tokens with > 10000 events in 24h)
    const abuseThreshold = 10000
    const potentialAbuse = topTokensArray.filter(t => t.event_count > abuseThreshold)

    return NextResponse.json({
      totalTokens: totalTokens || 0,
      blockedTokens: blockedTokens || 0,
      activeTokens: (totalTokens || 0) - (blockedTokens || 0),
      events24h: events24h || 0,
      eventsLastHour: eventsLastHour || 0,
      totalOnline: totalOnline || 0,
      topTokens: topTokensArray,
      potentialAbuse,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
