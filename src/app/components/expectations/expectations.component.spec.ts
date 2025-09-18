import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectationsComponent } from './expectations.component';

describe('ExpectationsComponent', () => {
  let component: ExpectationsComponent;
  let fixture: ComponentFixture<ExpectationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [ExpectationsComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
