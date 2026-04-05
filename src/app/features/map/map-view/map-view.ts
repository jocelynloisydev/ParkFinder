import { Component, OnInit, signal } from '@angular/core'
import * as L from 'leaflet'
import { ParksService } from '../../../core/services/parks'

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.html',
  styleUrl: './map-view.scss',
})
export class MapView implements OnInit {
  map!: L.Map
  userPosition = signal<{ lat: number; lng: number } | null>(null)

  constructor(private parksService: ParksService) {}

  ngOnInit() {
    this.initMap()
    this.locateUser()
  }

  initMap() {
    this.map = L.map('map', {
      center: [46.67, 5.22], // Louhans par défaut
      zoom: 13,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map)
  }

  locateUser() {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords

      // Mise à jour du signal
      this.userPosition.set({ lat: latitude, lng: longitude })

      // Centrage de la carte
      this.map.setView([latitude, longitude], 15)

      // Marqueur utilisateur
      L.marker([latitude, longitude]).addTo(this.map).bindPopup('Vous êtes ici').openPopup()

      // Récupération des parcs
      this.parksService.getParksAround(latitude, longitude).subscribe(parks => {
        parks.forEach(park => {
          L.marker([park.lat, park.lng]).addTo(this.map).bindPopup(`<b>${park.name}</b>`)
        })
      })
    })
  }
}
