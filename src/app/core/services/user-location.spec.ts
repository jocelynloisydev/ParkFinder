import { TestBed } from '@angular/core/testing'

import { Geolocation } from './user-location'

describe('Geolocation', () => {
  let service: Geolocation

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(Geolocation)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
