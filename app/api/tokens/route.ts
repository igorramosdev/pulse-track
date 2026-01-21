import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { generateToken } from '@/lib/token'
import { apiRateLimit } from '@/lib/rate-limit'
import type { WidgetDefaults } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Rate limit token creation (stricter - 10 per minute)
    if (!apiRateLimit(`token-create:${ip}`)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { siteUrl, siteName, widgetDefaults } = body as {
      siteUrl?: string
      siteName?: string
      widgetDefaults?: WidgetDefaults
    }

    const supabase = getSupabaseAdminClient()

    // Generate unique token with retries
    let token = ''
    let attempts = 0
    const maxAttempts = 5

    while (attempts < maxAttempts) {
      token = generateToken(8)
      
      // Check if token already exists
      const { data: existing } = await supabase
        .from('tokens')
        .select('token')
        .eq('token', token)
        .single()

      if (!existing) {
        break
      }
      
      attempts++
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Failed to generate unique token' },
        { status: 500 }
      )
    }

    // Create token
    const { data, error } = await supabase
      .from('tokens')
      .insert({
        token,
        site_url: siteUrl || null,
        site_name: siteName || null,
        widget_defaults: widgetDefaults || {},
        created_via_public: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Token creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create token' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      token: data.token,
      id: data.id,
      created_at: data.created_at,
    })
  } catch (error) {
    console.error('Token API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get token info
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

    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from('tokens')
      .select('token, created_at, site_url, site_name, widget_defaults')
      .eq('token', token)
      .eq('is_blocked', false)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Token GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
