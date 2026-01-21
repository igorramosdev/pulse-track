import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

// Check admin key
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminKey = process.env.ADMIN_KEY
  
  if (!adminKey) {
    console.error('ADMIN_KEY not set in environment')
    return false
  }
  
  return authHeader === `Bearer ${adminKey}`
}

// GET /api/admin/tokens - List all tokens with stats
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseAdminClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    // Get tokens with basic info
    const { data: tokens, error: tokensError, count } = await supabase
      .from('tokens')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (tokensError) {
      throw tokensError
    }

    // Get online counts for each token
    const tokensWithStats = await Promise.all(
      (tokens || []).map(async (token) => {
        const { data: onlineCount } = await supabase.rpc('get_online_count', {
          p_token: token.token,
        })
        
        // Get event count for the last 24 hours
        const { count: eventCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('token', token.token)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

        return {
          ...token,
          online_count: onlineCount || 0,
          events_24h: eventCount || 0,
        }
      })
    )

    return NextResponse.json({
      tokens: tokensWithStats,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Admin tokens error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/tokens - Update token (block/unblock)
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { token, is_blocked } = await request.json()

    if (!token || typeof is_blocked !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdminClient()
    
    const { data, error } = await supabase
      .from('tokens')
      .update({ is_blocked })
      .eq('token', token)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, token: data })
  } catch (error) {
    console.error('Admin update token error:', error)
    return NextResponse.json(
      { error: 'Failed to update token' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/tokens - Delete token
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdminClient()
    
    const { error } = await supabase
      .from('tokens')
      .delete()
      .eq('token', token)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin delete token error:', error)
    return NextResponse.json(
      { error: 'Failed to delete token' },
      { status: 500 }
    )
  }
}
