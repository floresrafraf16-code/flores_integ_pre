
export default defineNuxtRouteMiddleware((to) => {

  if (import.meta.server) return

  const user = localStorage.getItem('google_user')
  const token = localStorage.getItem('google_token')

  let isAuthenticated = false

  if (user && token) {
    try {
      const parsedUser = JSON.parse(user)

      isAuthenticated = !!parsedUser.email

    } catch {
      localStorage.removeItem('google_user')
      localStorage.removeItem('google_token')
    }
  }


  if (to.path === '/login' && isAuthenticated) {
    return navigateTo('/', { replace: true })
  }

  
  if (to.path !== '/login' && !isAuthenticated) {
    return navigateTo('/login', { replace: true })
  }

})
