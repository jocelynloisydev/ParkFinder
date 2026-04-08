import { Injectable, signal } from '@angular/core'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null)
  initialized = signal(false)
  private auth = getAuth() // utilise l'app initialisée dans main.ts

  constructor() {
    onAuthStateChanged(this.auth, u => {
      this.user.set(u)
      this.initialized.set(true)
    })
  }

  async register(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password)
    return cred.user
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password)
  }

  async logout() {
    await signOut(this.auth)
  }
}
