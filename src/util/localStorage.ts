export function getToken (): string | null {
  return localStorage.getItem('chatToken')
}

export function setToken (token: string):void {
  localStorage.setItem('chatToken', token)
}

export function clearToken ():void {
  localStorage.removeItem('chatToken')
}
