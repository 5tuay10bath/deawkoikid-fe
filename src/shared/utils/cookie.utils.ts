export const cookieUtils = {
  setCookie: (name: string, value: string, days: number = 7) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  },

  getCookie: (name: string): string | null => {
    const nameEQ = `${name}=`
    const ca = document.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },

  deleteCookie: (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
  },

  setAuthToken: (token: string) => {
    cookieUtils.setCookie("auth_token", token, 7)
  },

  getAuthToken: (): string | null => {
    return cookieUtils.getCookie("auth_token")
  },

  setFullName: (fullName: string) => {
    cookieUtils.setCookie("full_name", fullName, 7)
  },

  getFullName: (): string | null => {
    return cookieUtils.getCookie("full_name")
  },

  clearAuth: () => {
    cookieUtils.deleteCookie("auth_token")
    cookieUtils.deleteCookie("full_name")
  },
}
