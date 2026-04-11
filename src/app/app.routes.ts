import { Routes } from '@angular/router'
import { authGuard } from './core/guards/authGuard'
import { noAuthGuard } from './core/guards/noAuthGuard'
import { redirectGuard } from './core/guards/redirectGuard'

export const routes: Routes = [
  // Layout Auth (login/register)
  {
    path: '',
    canActivate: [redirectGuard],
    loadComponent: () =>
      import('./layout/shell/shell').then(m => m.Shell)
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/auth-layout/auth-layout').then(m => m.AuthLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/auth/login/login').then(m => m.Login),
      },
    ],
  },
  {
    path: 'register',
    canActivate:[noAuthGuard],
    loadComponent: () =>
      import('./features/auth/auth-layout/auth-layout').then(m => m.AuthLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/auth/register/register').then(m => m.Register),
      },
    ],
  },

  // Layout Shell (navbar + footer + map)
  {
    path: 'map',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/shell').then(m => m.Shell),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/map/map-view/map-view').then(m => m.MapView)
      }
    ]
  }
]
