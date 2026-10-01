import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FieldIcon } from '../../../../icon/field-icon';

/**
 * A modal carousel over a set of image URLs, built on the native <dialog>
 * element so focus trapping, Esc to close and the backdrop come for free.
 */
@Component({
  selector: 'lib-image-gallery-modal',
  imports: [FieldIcon],
  templateUrl: './image-gallery-modal.html',
  styleUrl: './image-gallery-modal.css',
})
export class ImageGalleryModal {
  images = input.required<string[]>();
  open = model.required<boolean>();
  /** Describes the set being shown, e.g. the field's label. */
  alt = input<string>('Uploaded image');

  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly index = signal(0);
  protected readonly current = computed(
    () => this.images()[this.index()] ?? null
  );

  constructor() {
    // Light dismiss: a click that lands on the <dialog> itself (not its
    // content) is a click on the backdrop. Esc is handled natively. Bound in
    // code because it is a pointer-only shortcut, not a control of its own.
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.dialog().nativeElement;
      const onClick = (event: MouseEvent) => {
        if (event.target === el) this.open.set(false);
      };
      el.addEventListener('click', onClick);
      destroyRef.onDestroy(() => el.removeEventListener('click', onClick));
    });

    effect(() => {
      const el = this.dialog().nativeElement;
      if (this.open() && !el.open) {
        this.index.set(0);
        // showModal is missing in some test DOMs; fall back to the attribute.
        if (typeof el.showModal === 'function') el.showModal();
        else el.setAttribute('open', '');
      } else if (!this.open() && el.open) {
        if (typeof el.close === 'function') el.close();
        else el.removeAttribute('open');
      }
    });
  }

  /** Wraps around in both directions, like the old circular galleria. */
  step(delta: number) {
    const count = this.images().length;
    if (count) this.index.update((i) => (i + delta + count) % count);
  }

  /** Native close (Esc, or the dialog closing itself) must update the model. */
  onClose() {
    this.open.set(false);
  }
}
