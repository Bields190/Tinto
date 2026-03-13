import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface PhotoSlot {
  file?: File;
  url?: string;
}

@Component({
  selector: 'app-adicionar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adicionar.html',
  styleUrl: './adicionar.scss',
})
export class Adicionar {
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  form: FormGroup;
  rating = 0;
  hoverRating = 0;
  photos: PhotoSlot[] = Array.from({ length: 4 }, () => ({}));

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nomeVinho: ['', Validators.required],
      vinicola: ['', Validators.required],
      uva: ['', Validators.required],
      pais: ['', Validators.required],
      teorAlcoolico: [7],
      dataConsumo: [''],
      harmonizacao: [''],
      comments: [''],
      rating: [0]
    });
  }

  setRating(value: number) {
    this.rating = value;
    this.form.get('rating')?.setValue(value);
  }

  setHover(value: number) {
    this.hoverRating = value;
  }

  clearHover() {
    this.hoverRating = 0;
  }

  triggerFileInput(index: number) {
    const input = this.fileInputs.toArray()[index]?.nativeElement;
    input?.click();
  }

  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    // Revoke previous object URL if exists
    const existing = this.photos[index]?.url;
    if (existing) {
      URL.revokeObjectURL(existing);
    }

    this.photos[index] = { file, url };
    // Force change detection for *ngFor / template update
    this.photos = [...this.photos];

    // Reset input to allow selecting the same file again
    input.value = '';
  }
}
