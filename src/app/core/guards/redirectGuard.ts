import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../services/auth'

export const redirectGuard = async () => {
  const auth = inject(AuthService)
  const router = inject(Router)

  // Attendre la restauration de session Firebase
  while (!auth.initialized()) {
    await new Promise(r => setTimeout(r, 10))
  }

  if (auth.user()) {
    router.navigate(['/map'])
  } else {
    router.navigate(['/login'])
  }

  return false
}
