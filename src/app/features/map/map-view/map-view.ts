import { Component, effect, OnInit, signal } from '@angular/core'
import * as L from 'leaflet'
import { Icon } from 'leaflet'
import { ParksService } from '../../../core/services/parks'

/* Correction des icônes Leaflet
Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
})*/

const parkIcon = L.icon({
  iconUrl: 'assets/icons/parc-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

const userIcon = L.icon({
  iconUrl: 'assets/icons/user-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

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

  // Effect pour centrer la carte sur un parc sélectionné
  selectedEffect = effect(() => {
    const selected = this.parksService.selectedPark()
    if (selected) {
      this.map.setView([selected.lat, selected.lng], 17)
    }
  })

  // Effect pour afficher les parcs sur la carte
  parksEffect = effect(() => {
    const parks = this.parksService.parks()
    if (!this.map) return

    parks.forEach(park => {
      L.marker([park.lat, park.lng], { icon: parkIcon }).addTo(this.map).bindPopup(`<b>${park.name}</b>`)
    })
  })

  ngOnInit() {
    this.initMap()
    this.locateUser()
  }

  initMap() {
    this.map = L.map('map', {
      center: [46.67, 5.22],
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
      L.marker([latitude, longitude], { icon: userIcon }).addTo(this.map).bindPopup('Vous êtes ici').openPopup()

      // Récupération des parcs, charge les parcs dans le signal
      this.parksService.loadParks(latitude, longitude)
    })
  }
}
