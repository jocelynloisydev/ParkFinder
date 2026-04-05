import { Component, inject } from '@angular/core'
import { NgFor } from '@angular/common'
import { MatListModule } from '@angular/material/list'
import { ParksService } from '../../../core/services/parks'

@Component({
  selector: 'app-park-list',
  standalone: true,
  imports: [NgFor, MatListModule],
  templateUrl: './park-list.html',
  styleUrl: './park-list.scss',
})
export class ParkList {
  parksService = inject(ParksService)

  selectPark(park: any) {
    this.parksService.selectPark(park)
  }
}
