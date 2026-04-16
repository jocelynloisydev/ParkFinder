import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<'light' | 'dark'>('light')

  constructor() {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') this.setDark()
    else this.setLight()
  }

  setLight() {
    document.documentElement.setAttribute('data-theme', 'light')
    this.theme.set('light')
    localStorage.setItem('theme', 'light')
  }

  setDark() {
    document.documentElement.setAttribute('data-theme', 'dark')
    this.theme.set('dark')
    localStorage.setItem('theme', 'dark')
  }

  toggle() {
    this.theme() === 'light' ? this.setDark() : this.setLight()
  }
}
