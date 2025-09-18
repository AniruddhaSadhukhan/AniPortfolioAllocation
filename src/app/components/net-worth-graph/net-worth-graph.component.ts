import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { Subscription } from "rxjs";
import { NavItem } from "../../models/nav-item";
import { AuthService } from "../../services/auth.service";
import { PortfolioService } from "../../services/portfolio.service";
import { getCurrencyUnit } from "../../utils/currency-unit.pipe";
import { getNavItems } from "../../utils/nav-items";

@Component({
  selector: "app-net-worth-graph",
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: "./net-worth-graph.component.html",
  styleUrl: "./net-worth-graph.component.scss",
})
export class NetWorthGraphComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  chart: anychart.charts.Cartesian | undefined;
  loading = true;
  navItems: NavItem[] = getNavItems("Dashboard", "Manage", "Allocation");
  netWorthData: { timestamp: Date; total_value: number }[] = [];

  constructor(private portfolio: PortfolioService, public auth: AuthService) {}

  ngOnInit(): void {
    this.subscription = this.portfolio.getChanges().subscribe({
      next: (res: any) => {
        if (res && res.changes) {
          this.netWorthData = res.changes
            .map((c: any) => ({
              timestamp: (c.timestamp as any).toDate
                ? c.timestamp.toDate()
                : new Date(c.timestamp),
              total_value: c.total_value,
            }))
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          this.renderChart();
        } else {
          this.loading = false;
        }
      },
      error: () => (this.loading = false),
    });
  }

  private renderChart() {
    anychart.graphics.useAbsoluteReferences(false);
    const data = this.netWorthData.map((d) => ({
      x: d.timestamp,
      value: d.total_value,
    }));
    const dataSet = anychart.data.set(data);
    const mapping = dataSet.mapAs({ x: "x", value: "value" });
    this.chart = anychart.area();
    this.chart.background().enabled(false);
    this.chart.animation(true);
    this.chart.title(null);
    this.chart
      .yAxis()
      .labels()
      .format(function () {
        return getCurrencyUnit(this.value);
      });
    // Use proper date-time scale ("time" can throw if not recognized in current AnyChart build)
    this.chart.xScale("date-time");
    this.chart
      .xAxis()
      .labels()
      .format(function () {
        return anychart.format.dateTime(this.tickValue, "dd MMM yy");
      });
    const series = this.chart.area(mapping);
    series.hovered().markers(true);
    series.stroke("#4dabf7");
    series.fill("#4dabf7 0.3");
    series
      .tooltip()
      .useHtml(true)
      .title(false) // prevent automatic X value title repeating the date
      .separator(false)
      .format(function () {
        return (
          "<b>" +
          anychart.format.dateTime(this.x, "dd MMM yyyy") +
          "</b><br/>" +
          getCurrencyUnit(this.value)
        );
      });
    const containerEl = document.getElementById("net-worth-container");
    if (containerEl) containerEl.innerHTML = "";
    this.chart.container("net-worth-container");
    this.chart.draw();
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
}
