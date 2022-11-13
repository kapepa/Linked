import { TestBed } from '@angular/core/testing';

import { ConversationResolver } from './conversation.resolver';

describe('ConversationResolver', () => {
  let resolver: ConversationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ConversationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
