import { Routes } from '@angular/router'
import { Shell } from './layout/shell/shell'
import { authGuard } from './core/guards/auth'
import { noAuthGuard } from './core/guards/noAuthGuard'

export const routes: Routes = [
  // Layout Auth (login/register)
  {
    path: '',
    children: [
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
    ],
  },

  // Layout Shell (navbar + footer + map)
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell').then(m => m.Shell),
    canActivate: [authGuard],
    children: [
      {
        path: 'map',
        loadComponent: () =>
          import('./features/map/map-view/map-view').then(m => m.MapView),
      },
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full',
      },
    ],
  },
]

