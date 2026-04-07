import { Component, effect, OnInit, signal } from '@angular/core'
import { ParksService } from '../../../core/services/parks'
import { loadGoogleMaps } from '../../../core/utils/google-maps-loader';

/// <reference types="@types/google.maps" />
declare const google: any

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.html',
  styleUrl: './map-view.scss',
})
export class MapView implements OnInit {
  map!: google.maps.Map
  userPosition = signal<{ lat: number; lng: number } | null>(null)
  markers: google.maps.marker.AdvancedMarkerElement[] = []

  constructor(private parksService: ParksService) {}

  // Effect pour centrer la carte sur un parc sélectionné
  selectedEffect = effect(() => {
    const selected = this.parksService.selectedPark()
    if (selected && this.map) {
      this.map.setCenter({ lat: selected.lat, lng: selected.lng })
      this.map.setZoom(17)
    }
  })

  // Effect pour afficher les parcs sur la carte
  parksEffect = effect(() => {
    const parks = this.parksService.parks()
    if (!this.map || !parks.length) return

    this.markers.forEach(m => (m.map = null))
    this.markers = []

    parks.forEach(park => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        position: { lat: park.lat, lng: park.lng },
        title: park.name,
        content: this.createCustomIcon('assets/icons/parc-icon.png'),
      })

      const info = new google.maps.InfoWindow({
        content: `<b>${park.name}</b><br>${park.address ?? ''}`,
      })

      marker.addListener('click', () => {
        info.open(this.map, marker)
        this.parksService.selectPark(park)
      })

      this.markers.push(marker)
    })
  })

  async ngOnInit() {
    await loadGoogleMaps('AIzaSyB67K1gwK2TTDQTytXdRL1qK-TdVertlms')
    this.initMap()
    this.locateUser()
  }

  initMap() {
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat: 46.67, lng: 5.22 },
        zoom: 13,
        mapId: 'DEMO_MAP_ID',
      }
    )
  }

  locateUser() {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords

      // Mise à jour du signal
      this.userPosition.set({ lat: latitude, lng: longitude })

      // Centrage de la carte
      this.map.setCenter({ lat: latitude, lng: longitude })
      this.map.setZoom(15)

      // Marqueur utilisateur
      new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        position: { lat: latitude, lng: longitude },
        title: 'Vous êtes ici',
        content: this.createCustomIcon('assets/icons/user-icon.png'),
      })

      // Récupération des parcs, charge les parcs dans le signal
      this.parksService.loadParks(latitude, longitude)
    })
  }

  // Génère un élément HTML pour les icônes personnalisées
  private createCustomIcon(url: string): HTMLElement {
    const img = document.createElement('img')
    img.src = url
    img.style.width = '32px'
    img.style.height = '32px'
    img.style.transform = 'translate(-50%, -50%)'
    return img
  }
}
