import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChartPageComponent } from "./chart-page/chart-page.component";
import { TablePageComponent } from "./table-page/table-page.component";
import { AuthGuard } from "./services/auth.guard";
import { AllocationComponent } from "./allocation/allocation.component";
import { CategoryComponent } from "./category/category.component";
import { ExpectationsComponent } from "./expectations/expectations.component";

const routes: Routes = [
  { path: "view", component: ChartPageComponent, canActivate: [AuthGuard] },
  { path: "edit", component: TablePageComponent, canActivate: [AuthGuard] },
  { path: "category", component: CategoryComponent, canActivate: [AuthGuard] },
  {
    path: "expectations",
    component: ExpectationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "allocation",
    component: AllocationComponent,
    canActivate: [AuthGuard],
  },
  // default fallback route
  { path: "**", redirectTo: "/view" },
];

/*
 Pages:             Nav Buttons
  1. Dashboard   : Manage Allocation
  2. Manage      : Dashboard Allocation
  3. Category    : Dashboard Allocation Expectations
  4. Allocation  : Dashboard Expectations Category
  5. Expectation : Dashboard Allocation Category
*/

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
