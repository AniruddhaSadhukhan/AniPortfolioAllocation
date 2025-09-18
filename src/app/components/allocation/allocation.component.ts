import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { round } from "lodash-es";
import { Subscription } from "rxjs";
import { NavItem } from "src/app/models/nav-item";
import { getCurrencyUnit } from "src/app/utils/currency-unit.pipe";
import { getNavItems } from "src/app/utils/nav-items";
import { PortfolioService } from "../../services/portfolio.service";
import { Button } from "primeng/button";

@Component({
    selector: "app-allocation",
    templateUrl: "./allocation.component.html",
    styleUrls: ["./allocation.component.scss"],
    imports: [Button, RouterLink]
})
export class AllocationComponent implements OnInit, OnDestroy {
  private service = inject(PortfolioService);
  private router = inject(Router);

  categories = [];
  total: any = {};
  chart: anychart.charts.Sunburst;
  subscription: Subscription;

  navItems: NavItem[] = getNavItems("Dashboard", "Expectation", "Category");

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
    if (this.chart && this.chart.dispose) {
      try {
        this.chart.dispose();
      } catch {}
    }
  }

  ngOnInit() {
    this.subscription = this.service.getExpectations().subscribe({
      next: (res) => {
        const exp: any = res;
        this.categories = exp.categories;
        this.total = exp.total;
        this.refresh();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  refresh(): void {
    // create data
    const chartData = [
      {
        name: "Total",
        return: round(this.total.wt_exp_ret, 2),
        children: this.categories.map((elem) => ({
          name: elem.category,
          id: elem.category,
          return: round(elem.wt_exp_ret, 2),
          children: elem.investments,
          percent: round(elem.weightage, 2),
        })),
      },
    ];

    // console.log(chartData);

    anychart.graphics.useAbsoluteReferences(false);
    // create a chart and set the data
    this.chart = anychart.sunburst(chartData, "as-tree");

    // set the calculation mode
    this.chart.calculationMode("parent-independent");

    // enable HTML for labels
    this.chart.labels().useHtml(true);

    // configure labels of categories
    this.chart.labels().format(function () {
      return `<span><b>${
        this.name
      }</b></span><br>(${getCurrencyUnit(this.value)} - ${this.getData("percent")}%)<br><i>@${this.getData("return")}%</i>`;
    });

    //Tooltip
    this.chart
      .tooltip()
      .useHtml(true)
      .format(function () {
        return `<span><b>${
          this.name
        }</b></span><br>(${getCurrencyUnit(this.value)})`;
      });

    // configure labels of center
    this.chart
      .level(0)
      .labels()
      .format(function () {
        return `<span><b>${
          this.name
        }</b></span><br>(${getCurrencyUnit(this.value)})<br><b><i>@${this.getData("return")}%</i></b>`;
      });

    // configure labels of leaves
    this.chart
      .leaves()
      .labels()
      .format(function () {
        return `<span><b>${
          this.name
        }</b></span><br>(${getCurrencyUnit(this.value)})`;
      });

    // configure the chart stroke
    this.chart.normal().stroke("#fff", 0.8);

    // darken color towards the leaf
    this.chart.fill(function () {
      return (
        anychart.color.darken(this.sourceColor, 0.05 * (this.level + 1)) + ""
      );
    });

    this.chart.level(2).thickness("30%");
    this.chart.level(0).thickness("30%");
    // set the position of labels
    this.chart.labels().position("circular");
    this.chart.padding(0);
    this.chart.background().enabled(false);
    // set the container id
    this.chart.container("allocation-chart");
    // initiate drawing the chart
    this.chart.draw();
  }

  navigate = (route) => {
    this.router.navigate([route]);
  };
}
