import { Component, EventEmitter, Output } from '@angular/core'
import { AuthService } from '../../core/services/auth'
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  async logout() {
    await this.auth.logout()
    this.router.navigate(['/login'])
  }

  @Output() menuHover = new EventEmitter<void>()

  openSidebar() {
    this.menuHover.emit()
  }
}
