import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Adega } from './adega';
import { AdegaService } from '../../service/adega.service';

describe('Adega', () => {
  let component: Adega;
  let fixture: ComponentFixture<Adega>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adega],
      providers: [
        provideRouter([]),
        {
          provide: AdegaService,
          useValue: {
            listarMeusVinhos: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Adega);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
