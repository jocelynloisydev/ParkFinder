import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Navbar } from '../navbar/navbar'
import { Footer } from '../footer/footer'
import { Sidebar } from '../sidebar/sidebar'

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Navbar, Footer, Sidebar],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {}
