import { Component, input, model } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'lib-image-gallery-modal',
  imports: [GalleriaModule, DialogModule],
  templateUrl: './image-gallery-modal.html'
})
export class ImageGalleryModal {
  images = input.required<string[]>();
  open = model.required<boolean>();
}
