import { Component, computed, inject } from '@angular/core'
import { NgFor, NgIf } from '@angular/common'
import { ParksService } from '../../../core/services/parks'
import { FavoritesService } from '../../../core/services/favorites'
import { FilterService } from '../../../core/services/filter'
import { distanceKm } from '../../../core/utils/distance'
import { UserLocationService } from '../../../core/services/user-location'

@Component({
  selector: 'app-park-list',
  standalone: true,
  imports: [NgFor, NgIf],
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

    // Filtre favoris
    if (this.filters.showFavorites()) {
      parks = parks.filter(p => this.favorites.isFavorite(p.id))
    }

    // Filtre distance
    const maxDist = this.filters.maxDistance()
    const user = this.userLocation.userPosition()

    if (maxDist && user) {
      parks = parks.filter(p => {
        const d = distanceKm(user.lat, user.lng, p.lat, p.lng)
        return d <= maxDist
      })
    }

    return parks
  })

  selectPark(park: any) {
    this.parksService.selectPark(park)
  }
}
