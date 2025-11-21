/// <reference types="vite/client" />

interface Window {
  __DEAWKOIKID_API_BASE_URL__: string
}

declare module ".css" {
  const content: Record<string, string>
  export default content
}

declare module ".scss" {
  const content: Record<string, string>
  export default content
}

declare module "*.sass" {
  const content: Record<string, string>
  export default content
}
