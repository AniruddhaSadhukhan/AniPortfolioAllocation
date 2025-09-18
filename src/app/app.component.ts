import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { NavItem } from "./models/nav-item";
import { getNavItems } from "./utils/nav-items";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: [
        "./app.component.scss",
        "../../node_modules/anychart/dist/css/anychart-ui.min.css",
        "../../node_modules/anychart/dist/fonts/css/anychart-font.min.css",
    ],
    standalone: false
})
export class AppComponent implements OnInit {
  auth = inject(AuthService);
  private router = inject(Router);

  sidebarVisible = false;
  navItems : NavItem[] = getNavItems("Dashboard", "Manage", "Allocation", "Expectation", "Category");

  user: any = null;
  loading = true;
  ngOnInit(): void {
    this.auth.user$.subscribe((res) => {
      // console.log(res);
      this.user = res;
      this.loading = false;
      if (res) this.router.navigate(["/view"]);
    });
  }
}
