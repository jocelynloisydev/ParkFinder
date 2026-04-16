import { effect, Injectable, signal } from '@angular/core'
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { AuthService } from './auth'

export interface FavoritePark {
  id: string
  name: string
  lat: number
  lng: number
  address?: string
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  favorites = signal<FavoritePark[]>([])

  private firestore = getFirestore()
  private unsubscribe: (() => void) | null = null

  constructor(private auth: AuthService) {

    // Charger les favoris de l'utilisateur connecté
    effect(() => {
      const user = this.auth.user()

      // Si un listener existe, on le coupe proprement
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }

      // Si pas connecté → vider les favoris
      if (!user) {
        this.favorites.set([])
        return
      }

      // Sinon → attacher un nouveau listener Firestore
      const favsRef = collection(this.firestore, `users/${user.uid}/favorites`)

      this.unsubscribe = onSnapshot(favsRef, snapshot => {
        const list: FavoritePark[] = []
        snapshot.forEach(doc => list.push(doc.data() as FavoritePark))
        this.favorites.set(list)
      })
    })
  }

  // Ajouter un favori
  async addFavorite(park: FavoritePark) {
    const user = this.auth.user()
    if (!user) return

    const ref = doc(this.firestore, `users/${user.uid}/favorites/${park.id}`)
    await setDoc(ref, park)
  }

  // Supprimer un favori
  async removeFavorite(id: string) {
    const user = this.auth.user()
    if (!user) return

    const ref = doc(this.firestore, `users/${user.uid}/favorites/${id}`)
    await deleteDoc(ref)
  }

  // Vérifier si un parc est en favori
  isFavorite(id: string): boolean {
    return this.favorites().some(f => f.id === id)
  }
}
