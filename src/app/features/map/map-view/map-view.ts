import { Component, effect, OnInit, signal } from '@angular/core'
import { ParksService } from '../../../core/services/parks'
import { loadGoogleMaps } from '../../../core/utils/google-maps-loader';
import { environment } from '../../../../environments/environment'
import { NgIf } from '@angular/common';

/// <reference types="@types/google.maps" />
declare const google: any

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.html',
  styleUrl: './map-view.scss',
  imports: [NgIf],
})
export class MapView implements OnInit {
  map!: google.maps.Map
  userPosition = signal<{ lat: number; lng: number } | null>(null)
  markers: google.maps.marker.AdvancedMarkerElement[] = []
  infoWindow!: google.maps.InfoWindow
  desktopModeWarning = false

  constructor(private parksService: ParksService) {}

  // Détection du mode "Afficher le site de bureau" sur mobile
  private isMobileDesktopMode(): boolean {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isWide = window.innerWidth > 800
    return isTouchDevice && isWide
  }

  // Effect pour centrer la carte sur un parc sélectionné
  selectedEffect = effect(() => {
    const selected = this.parksService.selectedPark()
    if (selected && this.map) {
      this.map.setCenter({ lat: selected.lat, lng: selected.lng })
      this.map.setZoom(16)
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

      marker.addListener('gmp-click', () => {
        this.infoWindow.setContent(`<b>${park.name}</b><br>${park.address ?? ''}`)
        this.infoWindow.open(this.map, marker)
        this.parksService.selectPark(park)
      })

      this.markers.push(marker)
    })
  })

  async ngOnInit(): Promise<void> {
    /*
    if (this.isMobileDesktopMode()) {
      this.desktopModeWarning = true
      return
    }
    */

    try {
      await loadGoogleMaps(environment.google.mapsApiKey)
      this.initMapAfterDomReady()
    } catch (err) {
      console.error('Google Maps failed to load', err)
    }
  }

  // Attendre que le layout soit stabilisé
  private initMapAfterDomReady() {
    const mapEl = document.getElementById('map')
    if (!mapEl) {
      console.error('Map container not found')
      return
    }

    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) {
        observer.disconnect()
        this.initMap()
        this.infoWindow = new google.maps.InfoWindow()
        this.locateUser()
      }
    })

    observer.observe(mapEl)
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 46.67, lng: 5.22 },
      zoom: 13,
      mapId: 'DEMO_MAP_ID',
    })

    window.addEventListener('resize', () => {
      this.forceMapStabilization()
    })
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

  private forceMapStabilization() {
    if (!this.map) return

    const center = this.map.getCenter()
    google.maps.event.trigger(this.map, 'resize')

    if (center) this.map.setCenter(center)

    const zoom = this.map.getZoom()
    if (zoom) this.map.setZoom(zoom)
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
