export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}

export const getUserInfo = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  
  const decoded = decodeToken(token)
  if (!decoded) return null
  
  return {
    userId: decoded.userId,
    role: decoded.role,
    name: decoded.name
  }
}

export const isAdmin = () => {
  const userInfo = getUserInfo()
  return userInfo && userInfo.role === 'admin'
}

export const getUserName = () => {
  const userInfo = getUserInfo()
  return userInfo ? userInfo.name : null
}

