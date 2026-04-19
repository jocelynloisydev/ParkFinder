import { Component } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { AuthService } from '../../../core/services/auth'
import { ThemeService } from '../../../core/services/theme'

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  constructor(public theme: ThemeService) {}
}
