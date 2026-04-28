import { Component } from '@angular/core'
import { ParksService } from '../core/services/parks'
import { ParkList } from '../features/parks/park-list/park-list'
import { UserLocationService } from '../core/services/user-location'

@Component({
  selector: 'app-sandbox',
  standalone: true,
  imports: [ParkList],
  template: `
    <h2>Sandbox Park List</h2>
    <app-park-list></app-park-list>
  `,
})
export class Sandbox {
  constructor(
    private parks: ParksService,
    private userLocation: UserLocationService
  ) {
    navigator.geolocation.getCurrentPosition(pos => {
      // Position utilisateur par défaut
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude

      this.userLocation.setPosition(lat, lng)

      // Charger les vrais parcs autour de cette position
      this.parks.loadParks(lat, lng)
    })
  }
}
