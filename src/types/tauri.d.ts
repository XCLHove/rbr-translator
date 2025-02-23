export {}

declare global {
  type UpdatePlatformValue = {
    signature: string
    url: string
  }

  type UpdateRawJson = {
    notes: string
    platforms: Record<string, UpdatePlatformValue>
    pub_date: string
    version: string
  }
}
