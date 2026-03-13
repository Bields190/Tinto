import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesVinho } from './detalhes-vinho';

describe('DetalhesVinho', () => {
  let component: DetalhesVinho;
  let fixture: ComponentFixture<DetalhesVinho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesVinho],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesVinho);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
