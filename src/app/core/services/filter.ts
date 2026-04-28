import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class FilterService {
  // Filtre favoris
  showFavorites = signal(false)

  // Filtre distance (en km)
  maxDistance = signal<number>(1)

  toggleFavorites() {
    this.showFavorites.update(v => !v)
  }

  setMaxDistance(km: number) {
    this.maxDistance.set(km)
  }
}
