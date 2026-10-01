import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

// Zoneless: the workspace does not import zone.js in tests, so the previous
// { zoneless: false } left TestBed without a change-detection provider and
// every spec failed on initTestEnvironment.
setupTestBed();
