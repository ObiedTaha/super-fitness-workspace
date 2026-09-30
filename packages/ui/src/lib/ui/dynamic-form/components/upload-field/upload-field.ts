import { Component, computed, input, signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { FieldConfig } from 'libs/shared/ui/src/models/field-types';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ImageGalleryModal } from './lib-image-gallery-modal/image-gallery-modal';

@Component({
  selector: 'lib-upload-field',
  imports: [FileUploadModule, ButtonModule, ImageGalleryModal],
  templateUrl: './upload-field.html',
  styleUrl: './upload-field.css',
})
export class UploadField {
  field = input.required<Extract<FieldConfig, { type: 'upload' }>>();
  control = input.required<FieldTree<File | File[] | string | string[] | null>>();

  fileNames = signal<string[]>([]);
  private selectedFiles: File[] = [];

  galleryOpen = signal(false);

  currentUrls = computed<string[]>(() => {
    const value = this.control()().value();
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.filter((v): v is string => typeof v === 'string');
    }
    return typeof value === 'string' ? [value] : [];
  });

  hasExistingImages = computed(() => this.currentUrls().length > 0);

  onUpload(event: FileUploadHandlerEvent) {
    this.selectedFiles = event.files;
    this.fileNames.set(event.files.map(f => f.name));

    this.control()().value.set(
      this.field().multiple ? event.files : (event.files[0] ?? null)
    );
  }
}