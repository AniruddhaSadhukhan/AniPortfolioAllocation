import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [
    "./app.component.scss",
    "../../node_modules/anychart/dist/css/anychart-ui.min.css",
    "../../node_modules/anychart/dist/fonts/css/anychart-font.min.css",
  ],
})
export class AppComponent implements OnInit {
  chartView = false;
  title = "AniPortfolioAllocation";
  sidebarVisible = false;
  items = [
    { label: "Dashboard", icon: "pi pi-slack", routerLink: ["/view"] },
    { label: "Manage", icon: "pi pi-book", routerLink: ["/edit"] },
    {
      label: "Allocation",
      icon: "pi pi-chart-pie",
      routerLink: ["/allocation"],
    },
    {
      label: "Expectation",
      icon: "pi pi-sliders-v",
      routerLink: ["/expectations"],
    },
    { label: "Category", icon: "pi pi-tags", routerLink: ["/category"] },
  ];

  user: any = null;
  loading = true;
  constructor(public auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.auth.user$.subscribe((res) => {
      // console.log(res);
      this.user = res;
      this.loading = false;
      if (res) this.router.navigate(["view"]);
    });
  }
}
