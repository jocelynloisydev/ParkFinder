import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ParkList } from './park-list'

describe('ParkList', () => {
  let component: ParkList
  let fixture: ComponentFixture<ParkList>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkList],
    }).compileComponents()

    fixture = TestBed.createComponent(ParkList)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
