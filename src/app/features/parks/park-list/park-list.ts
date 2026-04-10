import { Component, inject } from '@angular/core'
import { NgFor } from '@angular/common'
import { ParksService } from '../../../core/services/parks'

@Component({
  selector: 'app-park-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './park-list.html',
  styleUrl: './park-list.scss',
})
export class ParkList {
  parksService = inject(ParksService)

  selectPark(park: any) {
    this.parksService.selectPark(park)
  }
}
