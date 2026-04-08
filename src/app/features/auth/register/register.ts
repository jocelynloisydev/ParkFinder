import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../../core/services/auth'
import { CommonModule } from '@angular/common'
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  email = ''
  password = ''
  error = ''

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    this.error = ''
    try {
      await this.auth.register(this.email, this.password)
      this.router.navigate(['/map'])
      // Optionnel : redirection
    } catch (e: any) {
      this.error = e.message ?? 'Erreur lors de l’inscription'
    }
  }
}
