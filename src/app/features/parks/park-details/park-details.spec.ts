import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ParkDetails } from './park-details'

describe('ParkDetails', () => {
  let component: ParkDetails
  let fixture: ComponentFixture<ParkDetails>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkDetails],
    }).compileComponents()

    fixture = TestBed.createComponent(ParkDetails)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
