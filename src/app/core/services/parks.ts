import { Injectable, signal } from '@angular/core'
import { loadGoogleMaps } from '../utils/google-maps-loader';

declare const google: any

@Injectable({
  providedIn: 'root',
})
export class ParksService {
  parks = signal<any[]>([])
  selectedPark = signal<any | null>(null)

  async loadParks(lat: number, lng: number) {
    await loadGoogleMaps('AIzaSyB67K1gwK2TTDQTytXdRL1qK-TdVertlms')

    const { places } = await google.maps.places.searchNearby({
      locationRestriction: {
        circle: {
          center: { lat, lng },
          radius: 2000,
        },
      },
      includedTypes: ['park'],
      maxResultCount: 20,
      language: 'fr',
      region: 'FR',
    })

    this.parks.set(
      places.map((p: any) => ({
        id: p.id,
        name: p.displayName?.text,
        lat: p.location?.latitude,
        lng: p.location?.longitude,
        address: p.formattedAddress,
        rating: p.rating,
      }))
    )
  }

  selectPark(park: any) {
    this.selectedPark.set(park)
  }
}
