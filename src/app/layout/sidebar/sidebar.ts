import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  isOpen = false

  openSidebar() {
    this.isOpen = true
  }

  closeSidebar() {
    this.isOpen = false
  }
}
