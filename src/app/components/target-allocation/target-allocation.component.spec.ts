import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TargetAllocationComponent } from "./target-allocation.component";

describe("TargetAllocationComponent", () => {
  let component: TargetAllocationComponent;
  let fixture: ComponentFixture<TargetAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetAllocationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
