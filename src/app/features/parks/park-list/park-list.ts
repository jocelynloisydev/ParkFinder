import { Component, computed, inject } from '@angular/core'
import { DecimalPipe, NgFor, NgIf } from '@angular/common'
import { ParksService } from '../../../core/services/parks'
import { FavoritesService } from '../../../core/services/favorites'
import { FilterService } from '../../../core/services/filter'
import { distanceKm } from '../../../core/utils/distance'
import { UserLocationService } from '../../../core/services/user-location'

@Component({
  selector: 'app-park-list',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe],
  templateUrl: './park-list.html',
  styleUrl: './park-list.scss',
})
export class ParkList {
  constructor(
    public parksService: ParksService,
    public favorites: FavoritesService,
    public filters: FilterService,
    public userLocation: UserLocationService
  ) {}

  // Liste filtrée
  parksFiltered = computed(() => {
    let parks = this.parksService.parks()
    const user = this.userLocation.userPosition()

    // Filtre favoris
    if (this.filters.showFavorites()) {
      parks = parks.filter(p => this.favorites.isFavorite(p.id))
    }

    // Filtre distance
    const maxDist = this.filters.maxDistance()

    return parks
      .map(p => {
        const distance = user ? distanceKm(user.lat, user.lng, p.lat, p.lng) : null

        return { ...p, distance }
      })
      .filter(p => {
        if (!maxDist || !p.distance) return true
        return p.distance <= maxDist
      })
  })

  selectPark(park: any) {
    this.parksService.selectPark(park)
  }
}
