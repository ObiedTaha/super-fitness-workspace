import { TestBed } from '@angular/core/testing';
import { FormPage } from './form-page';

describe('FormPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPage],
    }).compileComponents();
  });

  it('renders the title it is given', async () => {
    const fixture = TestBed.createComponent(FormPage);
    fixture.componentRef.setInput('title', 'Create account');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('h1').textContent?.trim()).toBe(
      'Create account'
    );
  });
});
