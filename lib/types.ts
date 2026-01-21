export interface Token {
  id: string
  token: string
  created_at: string
  is_blocked: boolean
  widget_defaults: WidgetDefaults
  created_via_public: boolean
  site_url?: string
  site_name?: string
}

export interface WidgetDefaults {
  variant?: WidgetVariant
  color?: string
  size?: 'small' | 'large'
  position?: TabPosition
}

export type WidgetVariant = 'pill' | 'badge' | 'card' | 'floating'

export type TabPosition = 
  | 'left-upper' | 'left-middle' | 'left-lower'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
  | 'right-upper' | 'right-middle' | 'right-lower'

export interface Presence {
  token: string
  visitor_id: string
  last_seen_at: string
  path?: string
  referrer?: string
}

export interface Event {
  id: string
  token: string
  visitor_id: string
  type: 'pageview' | 'heartbeat'
  path?: string
  referrer?: string
  created_at: string
}

export interface OnlineStats {
  online: number
}

export interface TopPage {
  path: string
  visitor_count: number
}

export interface TimelinePoint {
  minute: string
  visitor_count: number
}

export interface CollectPayload {
  token: string
  visitorId: string
  type: 'pageview' | 'heartbeat'
  path?: string
  referrer?: string
}

export interface WidgetConfig {
  token: string
  variant: WidgetVariant
  color?: string
  size?: 'small' | 'large'
  position?: TabPosition
}

// i18n types
export type Locale = 'en' | 'pt'

export interface Dictionary {
  meta: {
    title: string
    description: string
  }
  nav: {
    home: string
    getStarted: string
    stats: string
    features: string
    pricing: string
  }
  hero: {
    title: string
    subtitle: string
    cta: string
    demo: string
  }
  features: {
    title: string
    realtime: {
      title: string
      description: string
    }
    noSignup: {
      title: string
      description: string
    }
    privacy: {
      title: string
      description: string
    }
    customizable: {
      title: string
      description: string
    }
  }
  wizard: {
    title: string
    subtitle: string
    step1: string
    step2: string
    step3: string
    widgetTypes: {
      pill: string
      badge: string
      card: string
      floating: string
    }
    preview: string
    copyCode: string
    copied: string
    siteUrl: string
    siteName: string
    generate: string
  }
  stats: {
    title: string
    online: string
    topPages: string
    timeline: string
    visitors: string
    noData: string
  }
  footer: {
    privacy: string
    terms: string
    about: string
  }
  common: {
    loading: string
    error: string
    retry: string
  }
}
