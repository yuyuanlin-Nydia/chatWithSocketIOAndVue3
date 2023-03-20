export function getToken (): string | null {
  return localStorage.getItem('chatToken')
}

export function setToken (token: string):void {
  localStorage.setItem('chatToken', token)
}

export function clearToken ():void {
  localStorage.removeItem('chatToken')
}

export function getUserID (): string | null {
  return localStorage.getItem('userID')
}

export function setUserID (userID: string): void {
  localStorage.setItem('userID', userID)
}

export function clearUserID ():void {
  localStorage.removeItem('userID')
}
