import { Injectable, signal } from '@angular/core'
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParksService {
  parks = signal<any[]>([])
  selectedPark = signal<any | null>(null)

  async loadParks(lat: number, lng: number, radius: number = 10000) {
    const apiKey = environment.google.placesApiKey

    const url = `https://places.googleapis.com/v1/places:searchNearby`

    const body = {
      includedTypes: ['park'],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radius,
        },
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.location,places.formattedAddress,places.rating',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    this.parks.set(
      (data.places ?? []).map((p: any) => ({
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
