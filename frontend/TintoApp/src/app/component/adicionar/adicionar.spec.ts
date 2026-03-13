import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adicionar } from './adicionar';

describe('Adicionar', () => {
  let component: Adicionar;
  let fixture: ComponentFixture<Adicionar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adicionar],
    }).compileComponents();

    fixture = TestBed.createComponent(Adicionar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
