import { Component } from '@angular/core'
import { AuthService } from '../../core/services/auth'
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'
import { ThemeService } from '../../core/services/theme'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(public auth: AuthService, private router: Router, public theme: ThemeService) {}

  async logout() {
    await this.auth.logout()
    this.router.navigate(['/login'])
  }
}
