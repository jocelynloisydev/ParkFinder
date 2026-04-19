import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core'
import { ParksService } from '../../../core/services/parks'
import { loadGoogleMaps } from '../../../core/utils/google-maps-loader';
import { environment } from '../../../../environments/environment'
import { NgIf } from '@angular/common';
import { FavoritesService } from '../../../core/services/favorites';
import { ThemeService } from '../../../core/services/theme';
import { UserLocationService } from '../../../core/services/user-location'

/// <reference types="@types/google.maps" />
declare const google: any

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.html',
  styleUrl: './map-view.scss',
  imports: [NgIf],
})
export class MapView implements OnInit, OnDestroy {
  map!: google.maps.Map
  userPosition = signal<{ lat: number; lng: number } | null>(null)
  markers: google.maps.marker.AdvancedMarkerElement[] = []
  infoWindow!: google.maps.InfoWindow
  desktopModeWarning = false

  private parkMarkers: google.maps.marker.AdvancedMarkerElement[] = []
  private userMarker?: google.maps.marker.AdvancedMarkerElement
  private resizeListener?: () => void
  private mapReady = signal(false)

  // Map ID cloud
  private readonly MAP_ID = '20e9edcccea5d503e0899089'

  constructor(
    private parksService: ParksService,
    private favoritesService: FavoritesService,
    private theme: ThemeService,
    private userLocation: UserLocationService
  ) {}

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
    this.parkMarkers = []

    parks.forEach(park => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        position: { lat: park.lat, lng: park.lng },
        title: park.name,
        content: this.createCustomIcon(
          this.theme.theme() === 'dark'
            ? 'assets/icons/map/park-dark.png'
            : 'assets/icons/map/parc-icon.png'
        ),
      })

      marker.addListener('gmp-click', () => {
        const isFav = this.favoritesService.isFavorite(park.id)

        const html = `
          <div style="display:flex;justify-content:space-between;align-items:center;width:200px;">
            <div>
              <b>${park.name}</b><br>
              ${park.address ?? ''}
            </div>
            <div id="fav-${park.id}" style="font-size:22px;cursor:pointer;">
              ${isFav ? '⭐' : '☆'}
            </div>
          </div>
        `

        this.infoWindow.setContent(html)
        this.infoWindow.open(this.map, marker)
        this.parksService.selectPark(park)

        // Toggle favori
        setTimeout(() => {
          const favEl = document.getElementById(`fav-${park.id}`)
          if (!favEl) return

          favEl.addEventListener('click', () => {
            const isFavNow = this.favoritesService.isFavorite(park.id)

            if (isFavNow) {
              this.favoritesService.removeFavorite(park.id)
              favEl.innerHTML = '☆'
            } else {
              this.favoritesService.addFavorite({
                id: park.id,
                name: park.name,
                lat: park.lat,
                lng: park.lng,
                address: park.address,
              })
              favEl.innerHTML = '⭐'
            }
          })
        }, 50)
      })

      this.markers.push(marker)
      this.parkMarkers.push(marker)
    })
  })

  // Recrée la carte quand le thème change
  mapThemeEffect = effect(() => {
    const mode = this.theme.theme()
    if (!this.mapReady()) return

    const center = this.map.getCenter() ?? { lat: 46.67, lng: 5.22 }
    const zoom = this.map.getZoom() ?? 13

    this.parkMarkers.forEach(m => (m.map = null))
    if (this.userMarker) this.userMarker.map = null

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center,
        zoom,
        mapId: this.MAP_ID,
        colorScheme: mode === 'dark' ? google.maps.ColorScheme.DARK : google.maps.ColorScheme.LIGHT,
      } as any
    )

    this.parkMarkers.forEach(m => (m.map = this.map))
    if (this.userMarker) this.userMarker.map = this.map

    this.infoWindow = new google.maps.InfoWindow()
  })

  markerThemeEffect = effect(() => {
    const mode = this.theme.theme()

    const parkIcon =
      mode === 'dark' ? 'assets/icons/map/park-dark.png' : 'assets/icons/map/parc-icon.png'

    const userIcon =
      mode === 'dark' ? 'assets/icons/map/user-dark.png' : 'assets/icons/map/user-light.png'

    this.parkMarkers.forEach(marker => {
      marker.content = this.createCustomIcon(parkIcon)
    })

    if (this.userMarker) {
      this.userMarker.content = this.createCustomIcon(userIcon)
    }
  })

  async ngOnInit(): Promise<void> {
    if (this.isMobileDesktopMode()) {
      this.desktopModeWarning = true
      return
    }

    try {
      await loadGoogleMaps(environment.google.mapsApiKey)
      this.initMapAfterDomReady()
    } catch (err) {
      console.error('Google Maps failed to load', err)
    }
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener)
    }
  }

  // Attendre que le layout soit stabilisé
  private initMapAfterDomReady() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const mapEl = document.getElementById('map')
        if (!mapEl) {
          console.error('Map container not found')
          return
        }

        this.initMap(this.theme.theme())
        this.infoWindow = new google.maps.InfoWindow()
        this.locateUser()
      })
    })
  }

  initMap(mode: 'light' | 'dark') {
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat: 46.67, lng: 5.22 },
        zoom: 13,
        mapId: this.MAP_ID,
        colorScheme: mode === 'dark' ? google.maps.ColorScheme.DARK : google.maps.ColorScheme.LIGHT,
      } as any
    )

    this.mapReady.set(true)

    this.resizeListener = () => this.forceMapStabilization()
    window.addEventListener('resize', this.resizeListener)
  }

  locateUser() {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords

      // Mise à jour du signal
      this.userLocation.setPosition(latitude, longitude)

      // Centrage de la carte
      this.map.setCenter({ lat: latitude, lng: longitude })
      this.map.setZoom(15)

      // Marqueur utilisateur
      this.userMarker = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        position: { lat: latitude, lng: longitude },
        title: 'Vous êtes ici',
        content: this.createCustomIcon(
          this.theme.theme() === 'dark'
            ? 'assets/icons/map/user-dark.png'
            : 'assets/icons/map/user-light.png'
        ),
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
