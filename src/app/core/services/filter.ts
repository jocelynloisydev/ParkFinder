import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class FilterService {
  // Filtre favoris
  showFavorites = signal(false)

  // Filtre distance (en km)
  maxDistance = signal<number | null>(null)

  toggleFavorites() {
    this.showFavorites.update(v => !v)
  }

  setMaxDistance(km: number | null) {
    this.maxDistance.set(km)
  }
}
