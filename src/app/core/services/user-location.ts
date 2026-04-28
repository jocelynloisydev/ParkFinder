import { Injectable, signal } from '@angular/core'

export interface UserPosition {
  lat: number
  lng: number
}

@Injectable({
  providedIn: 'root',
})
export class UserLocationService {
  userPosition = signal<UserPosition | null>(null)

  setPosition(lat: number, lng: number) {
    this.userPosition.set({ lat, lng })
  }
}
