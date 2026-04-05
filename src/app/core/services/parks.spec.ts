import { TestBed } from '@angular/core/testing'

import { Parks } from './parks'

describe('Parks', () => {
  let service: Parks

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(Parks)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
