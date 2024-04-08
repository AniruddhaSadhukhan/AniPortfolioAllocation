import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllocationComponent } from "./components/allocation/allocation.component";
import { CategoryComponent } from "./components/category/category.component";
import { ChartPageComponent } from "./components/chart-page/chart-page.component";
import { ExpectationsComponent } from "./components/expectations/expectations.component";
import { TablePageComponent } from "./components/table-page/table-page.component";
import { AuthGuard } from "./services/auth.guard";

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
