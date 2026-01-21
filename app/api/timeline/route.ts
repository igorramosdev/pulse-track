import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { isValidToken } from '@/lib/token'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    if (!isValidToken(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
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

    // Get timeline using the database function
    const { data, error } = await supabase.rpc('get_timeline', {
      p_token: token,
    })

    if (error) {
      console.error('Get timeline error:', error)
      return NextResponse.json(
        { error: 'Failed to get timeline' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { timeline: data || [] },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error) {
    console.error('Timeline API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
