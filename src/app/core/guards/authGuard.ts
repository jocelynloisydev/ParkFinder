import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../services/auth'

export const authGuard = async () => {
  const auth = inject(AuthService)
  const router = inject(Router)

  // Attendre que Firebase ait fini de restaurer la session
  while (!auth.initialized()) {
    await new Promise(r => setTimeout(r, 10))
  }

  if (!auth.user()) {
    router.navigate(['/login'])
    return false
  }

  return true
}
