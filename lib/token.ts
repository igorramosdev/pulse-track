// Generate a unique, URL-safe token
export function generateToken(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  
  // Use crypto for better randomness if available
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      token += chars[array[i] % chars.length]
    }
  } else {
    for (let i = 0; i < length; i++) {
      token += chars[Math.floor(Math.random() * chars.length)]
    }
  }
  
  return token
}

// Generate a visitor ID for tracking
export function generateVisitorId(): string {
  return `v_${generateToken(16)}`
}

// Validate token format
export function isValidToken(token: string): boolean {
  return /^[a-z0-9]{4,32}$/.test(token)
}
