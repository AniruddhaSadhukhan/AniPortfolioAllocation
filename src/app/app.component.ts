import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";

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

  user: any = null;
  loading = true;
  constructor(public auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.auth.user$.subscribe((res) => {
      console.log(res);
      this.user = res;
      this.loading = false;
      if (res) this.router.navigate(["view"]);
    });
  }

  addEntry = () => {
    this.router.navigate(["edit"]);
  };
}
