import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { heartbeatRateLimit, apiRateLimit } from '@/lib/rate-limit'
import { isValidToken } from '@/lib/token'
import type { CollectPayload } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Check API rate limit
    if (!apiRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body: CollectPayload = await request.json()
    const { token, visitorId, type, path, referrer } = body

    // Validate required fields
    if (!token || !visitorId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate token format
    if (!isValidToken(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
    }

    // Check heartbeat rate limit (only for heartbeat type)
    if (type === 'heartbeat' && !heartbeatRateLimit(token, visitorId)) {
      // Silently accept but don't process (to avoid client-side errors)
      return NextResponse.json({ success: true, skipped: true })
    }

    const supabase = getSupabaseAdminClient()

    // Check if token exists and is not blocked
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .select('token, is_blocked')
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      )
    }

    if (tokenData.is_blocked) {
      return NextResponse.json(
        { error: 'Token is blocked' },
        { status: 403 }
      )
    }

    // Upsert presence (update last_seen_at if exists, insert if not)
    const { error: presenceError } = await supabase
      .from('presence')
      .upsert(
        {
          token,
          visitor_id: visitorId,
          last_seen_at: new Date().toISOString(),
          path: path || null,
          referrer: referrer || null,
        },
        {
          onConflict: 'token,visitor_id',
        }
      )

    if (presenceError) {
      console.error('Presence upsert error:', presenceError)
    }

    // Record event (only for pageviews to reduce storage)
    if (type === 'pageview') {
      const { error: eventError } = await supabase
        .from('events')
        .insert({
          token,
          visitor_id: visitorId,
          type,
          path: path || null,
          referrer: referrer || null,
        })

      if (eventError) {
        console.error('Event insert error:', eventError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Collect API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
