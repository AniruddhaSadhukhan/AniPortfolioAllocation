import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChartPageComponent } from "./chart-page/chart-page.component";
import { TablePageComponent } from "./table-page/table-page.component";
import { AuthGuard } from "./services/auth.guard";

const routes: Routes = [
  { path: "view", component: ChartPageComponent, canActivate: [AuthGuard] },
  { path: "edit", component: TablePageComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
