import { TestBed } from '@angular/core/testing';

import { EtherpadClientService } from './etherpad-client.service';

describe('EtherpadClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EtherpadClientService = TestBed.get(EtherpadClientService);
    expect(service).toBeTruthy();
  });
});
