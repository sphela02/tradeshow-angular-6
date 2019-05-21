import { TestBed, inject } from '@angular/core/testing';

import { PagetitleService } from './pagetitle.service';

describe('PagetitleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PagetitleService]
    });
  });

  it('should be created', inject([PagetitleService], (service: PagetitleService) => {
    expect(service).toBeTruthy();
  }));
});
