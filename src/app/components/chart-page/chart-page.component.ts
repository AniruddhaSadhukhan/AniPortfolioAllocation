import { Component, OnInit } from "@angular/core";
import { groupBy, map } from "lodash-es";
import { Subscription } from "rxjs";
import { NavItem } from "src/app/models/nav-item";
import { Allocation, PortfolioNode } from "src/app/models/portfolio";
import { getCurrencyUnit } from "src/app/utils/currency-unit.pipe";
import { getNavItems } from "src/app/utils/nav-items";
import { format } from "timeago.js";
import { AuthService } from "../../services/auth.service";
import { PortfolioService } from "../../services/portfolio.service";
@Component({
  selector: "app-chart-page",
  templateUrl: "./chart-page.component.html",
  styleUrls: ["./chart-page.component.scss"],
  standalone: false,
})
export class ChartPageComponent implements OnInit {
  data: Allocation;
  userName: string;
  lastEditedTime: any;
  omitOthers = true;
  subscription: Subscription;

  navItems: NavItem[] = getNavItems("Manage", "Allocation", "NetWorth");

  chart: anychart.charts.Sunburst;
  changed() {
    this.refresh();
  }

  constructor(private service: PortfolioService, public auth: AuthService) {}

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
    if (this.chart && this.chart.dispose) {
      try {
        this.chart.dispose();
      } catch {}
    }
  }

  ngOnInit() {
    this.subscription = this.service.getPortfolio().subscribe({
      next: (res) => {
        // console.log(res);
        if (res) {
          this.data = res;
          this.service.getLastEditedTimestamp().then((time: any) => {
            if (time) this.lastEditedTime = format(time);
          });
          this.auth.user$.subscribe((res) => {
            this.userName = res.displayName;
            this.refresh();
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * Calculate the total value of a node and its descendants.
   *
   * @param node The node to calculate the value of.
   * @return The total value of the node and its descendants.
   */
  calculateValue(node: PortfolioNode): number {
    // If the node has no children, return its own value.
    if (!node.children) {
      return node.value;
    }

    // Initialize the node's value to 0.
    node.value = 0;

    // Calculate the value of each child node and add it to the node's value.
    node.children.forEach((child) => {
      node.value += this.calculateValue(child);
    });

    // Return the total value of the node and its descendants.
    return node.value;
  }

  /**
   * Calculate the percentage of a node's value relative to its parent node.
   * And calculate the percentage of each child node recursively.
   *
   * @param node The node to calculate the percentage for.
   * @param parentValue The value of the node's parent. Default is 0.
   */
  calculatePercent(node: PortfolioNode, parentValue = 0) {
    // Calculate the percentage of the node's value relative to its parent
    if (parentValue)
      node.percent = Math.round((node.value / parentValue) * 100);

    // If the node has no children, return immediately.
    if (!node.children) {
      return;
    }

    // Calculate the percentage of each child node recursively.
    node.children.forEach((child) => {
      this.calculatePercent(child, node.value);
    });
  }

  generateTree(data, groups: string[]): PortfolioNode[] {
    // Portfolio > Group > Category > Item
    let tree = [
      {
        name: this.userName.split(" ")[0] || "Total",
        children: groups.map((groupName) => {
          return {
            name: groupName,
            children: map(
              groupBy(data[groupName], "category"),
              (items, categoryName) => {
                return {
                  name: categoryName,
                  children: items,
                };
              }
            ),
          };
        }),
      },
    ];

    this.calculateValue(tree[0]);
    this.calculatePercent(tree[0]);

    return tree;
  }

  refresh(): void {
    // Dispose existing chart instance to prevent multiple overlapping charts
    if (this.chart && this.chart.dispose) {
      try {
        this.chart.dispose();
      } catch {}
    }
    let groups = ["Debt", "Equity"];
    if (!this.omitOthers) groups.push("Others");

    let chartData = this.generateTree(this.data, groups);

    anychart.graphics.useAbsoluteReferences(false);
    // create a chart and set the data
    this.chart = anychart.sunburst(chartData, "as-tree");

    // set the calculation mode
    this.chart.calculationMode("parent-independent");

    // enable HTML for labels
    this.chart.labels().useHtml(true);
    // configure labels
    this.chart.labels().format(function () {
      return `<span><b>${
        this.name
      }</b></span><br>${getCurrencyUnit(this.value)}<br><i>(${this.getData("percent")}%)</i>`;
    });

    //Tooltip
    this.chart
      .tooltip()
      .useHtml(true)
      .format(function () {
        return `<span><b>${
          this.name
        }</b></span><br>${getCurrencyUnit(this.value)}`;
      });

    this.chart
      .level(0)
      .labels()
      .format(function () {
        return `<span><b>${
          this.name
        }</b></span><br>${getCurrencyUnit(this.value)}`;
      });

    // configure the chart stroke
    this.chart.normal().stroke("#fff", 0.8);

    // darken color towards the leaf
    this.chart.fill(function () {
      return (
        anychart.color.darken(this.sourceColor, 0.05 * (this.level + 1)) + ""
      );
    });

    // set the position of labels
    this.chart.labels().position("circular");
    this.chart.padding(1);
    this.chart.background().enabled(false);
    // set the container id
    this.chart.container("portfolio-chart");

    // initiate drawing the chart
    this.chart = this.chart.draw();
  }
}
