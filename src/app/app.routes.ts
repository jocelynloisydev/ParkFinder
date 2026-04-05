import { Routes } from '@angular/router'
import { Shell } from './layout/shell/shell'

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/map/map-view/map-view').then(m => m.MapView),
      },
      {
        path: 'parks',
        loadComponent: () => import('./features/parks/park-list/park-list').then(m => m.ParkList),
      },
      {
        path: 'parks/:id',
        loadComponent: () =>
          import('./features/parks/park-details/park-details').then(m => m.ParkDetails),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/favorites/favorites-page/favorites-page').then(m => m.FavoritesPage),
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/auth/profile/profile').then(m => m.Profile),
      },
    ],
  },
]
