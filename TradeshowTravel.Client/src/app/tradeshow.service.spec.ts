import { TestBed, inject } from '@angular/core/testing';

import { TradeshowService } from './tradeshow.service';

describe('TradeshowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TradeshowService]
    });
  });

  it('should be created', inject([TradeshowService], (service: TradeshowService) => {
    expect(service).toBeTruthy();
  }));
});
