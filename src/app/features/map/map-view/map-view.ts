import { Component, OnInit, signal } from '@angular/core'
import * as L from 'leaflet'

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.html',
  styleUrl: './map-view.scss',
})
export class MapView implements OnInit {
  map!: L.Map
  userPosition = signal<{ lat: number; lng: number } | null>(null)

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

      this.userPosition.set({ lat: latitude, lng: longitude })

      this.map.setView([latitude, longitude], 15)

      L.marker([latitude, longitude]).addTo(this.map).bindPopup('Vous êtes ici').openPopup()
    })
  }
}
