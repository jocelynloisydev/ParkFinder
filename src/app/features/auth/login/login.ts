import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../../core/services/auth'
import { CommonModule } from '@angular/common'
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = ''
  password = ''
  error = ''

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async submit() {
    this.error = ''
    try {
      await this.auth.login(this.email, this.password)
      this.router.navigate(['/map'])
      // éventuellement redirection après login
    } catch (e: any) {
      this.error = e.message ?? 'Erreur de connexion'
    }
  }
}
