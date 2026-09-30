import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadField } from './upload-field';

describe('UploadField', () => {
  let component: UploadField;
  let fixture: ComponentFixture<UploadField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadField],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
