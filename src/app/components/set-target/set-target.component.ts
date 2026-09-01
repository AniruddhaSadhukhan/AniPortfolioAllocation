import { Component, OnInit, inject, ChangeDetectionStrategy } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MessageService } from "primeng/api";
import { round } from "lodash-es";
import { NavItem } from "src/app/models/nav-item";
import {
  Allocation,
  Item,
  TargetAllocation,
  TargetSegment,
} from "src/app/models/portfolio";
import { getNavItems } from "src/app/utils/nav-items";
import { PortfolioService } from "../../services/portfolio.service";
import { SelectButton } from "primeng/selectbutton";
import { FormsModule } from "@angular/forms";
import { Button } from "primeng/button";
import { InputNumber } from "primeng/inputnumber";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-set-target",
  templateUrl: "./set-target.component.html",
  styleUrls: ["./set-target.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    SelectButton,
    FormsModule,
    Button,
    InputNumber,
    MultiSelect,
    RouterLink,
  ],
})
export class SetTargetComponent implements OnInit {
  private service = inject(PortfolioService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  readonly segments: TargetSegment[] = ["Equity", "Debt", "Others"];
  round = round;

  allocation: Allocation | null = null;

  targetSegments: Partial<Record<TargetSegment, number>> = {};
  targetCategories: Record<TargetSegment, Record<string, number>> = {
    Equity: {},
    Debt: {},
    Others: {},
  };
  selectedCategories: Record<TargetSegment, string[]> = {
    Equity: [],
    Debt: [],
    Others: [],
  };

  navItems: NavItem[] = getNavItems("Dashboard", "Target", "Allocation");

  ngOnInit() {
    this.service.getPortfolio().subscribe({
      next: (allocation) => {
        // Missing/partial docs from older data are normalised to empty arrays.
        this.allocation = allocation ?? ({} as Allocation);
        this.loadTarget();
      },
      error: (err) => console.log(err),
    });
  }

  private loadTarget() {
    this.service.getTarget().subscribe({
      next: (target) => {
        // Pre-existing users have no target doc; fall back to empty defaults.
        this.targetSegments = { ...(target?.segments ?? {}) };
        for (const seg of this.segments) {
          const cats = target?.categories?.[seg] ?? {};
          this.targetCategories[seg] = { ...cats };
          this.selectedCategories[seg] = Object.keys(cats);
        }
      },
      error: (err) => console.log(err),
    });
  }

  private itemsOf(segment: TargetSegment): Item[] {
    return this.allocation?.[segment] ?? [];
  }

  availableCategories(segment: TargetSegment): string[] {
    const set = new Set<string>();
    for (const item of this.itemsOf(segment)) {
      const c = (item.category ?? "").trim();
      if (c) set.add(c);
    }
    // Keep already-selected targets available even if the item was removed.
    for (const c of this.selectedCategories[segment]) set.add(c);
    return Array.from(set).sort();
  }

  onCategorySelectChange(segment: TargetSegment) {
    const selected = this.selectedCategories[segment];
    const current = this.targetCategories[segment];
    for (const c of selected) {
      if (!(c in current)) current[c] = 0;
    }
    for (const c of Object.keys(current)) {
      if (!selected.includes(c)) delete current[c];
    }
  }

  get segmentTargetTotal(): number {
    return this.segments.reduce(
      (sum, seg) => sum + (this.targetSegments[seg] ?? 0),
      0,
    );
  }

  categoryTargetTotal(segment: TargetSegment): number {
    return this.selectedCategories[segment].reduce(
      (sum, c) => sum + (this.targetCategories[segment][c] ?? 0),
      0,
    );
  }

  save() {
    const segments: Partial<Record<TargetSegment, number>> = {};
    const categories: Partial<Record<TargetSegment, Record<string, number>>> =
      {};
    for (const seg of this.segments) {
      const value = this.targetSegments[seg];
      if (value != null) segments[seg] = value;
      const cats = this.selectedCategories[seg];
      if (cats.length) {
        categories[seg] = cats.reduce(
          (acc, c) => {
            acc[c] = this.targetCategories[seg][c] ?? 0;
            return acc;
          },
          {} as Record<string, number>,
        );
      }
    }

    const data: TargetAllocation = { segments, categories };
    this.service
      .setTarget(data)
      .then(() => {
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Target allocation saved",
          life: 3000,
        });
        this.router.navigate(["/target-allocation"]);
      })
      .catch((err) => console.log(err));
  }
}
