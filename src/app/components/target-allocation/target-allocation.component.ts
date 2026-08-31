import { Component, OnInit, inject, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink } from "@angular/router";
import { round } from "lodash-es";
import { NavItem } from "src/app/models/nav-item";
import { Allocation, Item, TargetSegment } from "src/app/models/portfolio";
import { getNavItems } from "src/app/utils/nav-items";
import { PortfolioService } from "../../services/portfolio.service";
import { SelectButton } from "primeng/selectbutton";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { Button } from "primeng/button";
import { CurrencyUnitPipe } from "../../utils/currency-unit.pipe";

interface CategoryRow {
  category: string;
  currentValue: number;
  currentPercent: number;
  targetPercent: number;
  targetValue: number;
  diff: number;
}

interface SegmentRow {
  segment: TargetSegment;
  currentValue: number;
  currentPercent: number;
  hasTarget: boolean;
  targetPercent: number;
  targetValue: number;
  diff: number;
  categories: CategoryRow[];
}

@Component({
  selector: "app-target-allocation",
  templateUrl: "./target-allocation.component.html",
  styleUrls: ["./target-allocation.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    SelectButton,
    FormsModule,
    TableModule,
    Button,
    RouterLink,
    CurrencyUnitPipe,
  ],
})
export class TargetAllocationComponent implements OnInit {
  private service = inject(PortfolioService);

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

  navItems: NavItem[] = getNavItems("Dashboard", "SetTarget", "Allocation");

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

  get total(): number {
    return this.segments.reduce((sum, seg) => sum + this.segmentValue(seg), 0);
  }

  segmentValue(segment: TargetSegment): number {
    return this.itemsOf(segment).reduce((sum, n) => sum + (n.value ?? 0), 0);
  }

  categoryValue(segment: TargetSegment, category: string): number {
    return this.itemsOf(segment)
      .filter((n) => (n.category ?? "").trim() === category)
      .reduce((sum, n) => sum + (n.value ?? 0), 0);
  }

  get segmentTargetTotal(): number {
    return this.segments.reduce(
      (sum, seg) => sum + (this.targetSegments[seg] ?? 0),
      0,
    );
  }

  get rows(): SegmentRow[] {
    const total = this.total;
    return this.segments.map((segment) => {
      const currentValue = this.segmentValue(segment);
      const target = this.targetSegments[segment];
      const hasTarget = target != null;
      const targetValue = hasTarget ? (target / 100) * total : 0;
      const baseValue = hasTarget ? targetValue : currentValue;

      const categories: CategoryRow[] = this.selectedCategories[segment].map(
        (category) => {
          const catCurrent = this.categoryValue(segment, category);
          const catTargetPercent =
            this.targetCategories[segment][category] ?? 0;
          const catTargetValue = (catTargetPercent / 100) * baseValue;
          return {
            category,
            currentValue: catCurrent,
            currentPercent: currentValue
              ? (catCurrent / currentValue) * 100
              : 0,
            targetPercent: catTargetPercent,
            targetValue: catTargetValue,
            diff: catCurrent - catTargetValue,
          };
        },
      );

      return {
        segment,
        currentValue,
        currentPercent: total ? (currentValue / total) * 100 : 0,
        hasTarget,
        targetPercent: hasTarget ? target : 0,
        targetValue,
        diff: hasTarget ? currentValue - targetValue : 0,
        categories,
      };
    });
  }
}
