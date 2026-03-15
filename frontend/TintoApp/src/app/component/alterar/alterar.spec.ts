import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alterar } from './alterar';

describe('Alterar', () => {
  let component: Alterar;
  let fixture: ComponentFixture<Alterar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alterar],
    }).compileComponents();

    fixture = TestBed.createComponent(Alterar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
