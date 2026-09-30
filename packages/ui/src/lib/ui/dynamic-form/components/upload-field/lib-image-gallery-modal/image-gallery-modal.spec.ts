import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageGalleryModal } from './image-gallery-modal';

describe('ImageGalleryModal', () => {
  let component: ImageGalleryModal;
  let fixture: ComponentFixture<ImageGalleryModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGalleryModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageGalleryModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
