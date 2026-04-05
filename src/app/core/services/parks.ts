import { Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ParksService {
  private overpassUrl = 'https://overpass-api.de/api/interpreter'

  // Signal global contenant la liste des parcs
  parks = signal<any[]>([])

  // Signal du parc sélectionné
  selectedPark = signal<any | null>(null)

  constructor(private http: HttpClient) {}

  getParksAround(lat: number, lng: number, radius = 1500) {
    const query = `
      [out:json];
      (
        node["leisure"="park"](around:${radius}, ${lat}, ${lng});
        way["leisure"="park"](around:${radius}, ${lat}, ${lng});
        relation["leisure"="park"](around:${radius}, ${lat}, ${lng});
      );
      out center;
    `

    return this.http.post(this.overpassUrl, query, { responseType: 'text' }).pipe(
      map((response: any) => {
        const json = JSON.parse(response)
        return json.elements.map((el: any) => ({
          id: el.id,
          name: el.tags?.name || 'Parc sans nom',
          lat: el.lat || el.center?.lat,
          lng: el.lon || el.center?.lon,
          tags: el.tags || {},
        }))
      })
    )
  }

  // Mise à jour du signal global
  loadParks(lat: number, lng: number) {
    this.getParksAround(lat, lng).subscribe(parks => {
      this.parks.set(parks)
    })
  }

  // Sélection d’un parc
  selectPark(park: any) {
    this.selectedPark.set(park)
  }
}
