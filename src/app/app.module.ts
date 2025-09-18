/// <reference path="../../node_modules/anychart/dist/index.d.ts"/>

import { NgModule } from "@angular/core";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ConfirmationService, MessageService, SharedModule } from "primeng/api";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { ButtonGroupModule } from "primeng/buttongroup";
import { providePrimeNG } from "primeng/config";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DrawerModule } from "primeng/drawer"; // was SidebarModule
import { FloatLabelModule } from "primeng/floatlabel";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { MessageModule } from "primeng/message"; // replaces MessagesModule
import { MultiSelectModule } from "primeng/multiselect";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SelectModule } from "primeng/select"; // was DropdownModule
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { ToggleSwitchModule } from "primeng/toggleswitch"; // was InputSwitchModule
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AllocationComponent } from "./components/allocation/allocation.component";
import { CategoryComponent } from "./components/category/category.component";
import { ChartPageComponent } from "./components/chart-page/chart-page.component";
import { ExpectationsComponent } from "./components/expectations/expectations.component";
import { TablePageComponent } from "./components/table-page/table-page.component";
import { AuthService } from "./services/auth.service";
import { MockAuthService } from "./services/mock-auth.service";
import { MockPortfolioService } from "./services/mock-portfolio.service";
import { PortfolioService } from "./services/portfolio.service";
import LaraDarkBlue from "./theme/preset-lara-dark-blue";
import { CurrencyUnitPipe } from "./utils/currency-unit.pipe";

const config = {
  apiKey: "AIzaSyAGW6SyDNAjGg16LSoqVqyYhvxWawCjtss",
  authDomain: "aniportfolioallocation.firebaseapp.com",
  projectId: "aniportfolioallocation",
  storageBucket: "aniportfolioallocation.appspot.com",
  messagingSenderId: "1061219064104",
  appId: "1:1061219064104:web:036de84a7693c3a5fa581d",
  measurementId: "G-ZZMLL59W4M",
};

const PrimeModules = [
  SharedModule,
  ToolbarModule,
  AvatarModule,
  DrawerModule,
  TooltipModule,
  ButtonModule,
  MenuModule,
  ProgressSpinnerModule,
  ToggleSwitchModule,
  SelectButtonModule,
  TableModule,
  MultiSelectModule,
  TagModule,
  ButtonGroupModule,
  DialogModule,
  SelectModule,
  ConfirmDialogModule,
  InputTextModule,
  InputNumberModule,
  FloatLabelModule,
  MessageModule,
  ToastModule,
];

@NgModule({
  declarations: [
    AppComponent,
    ChartPageComponent,
    TablePageComponent,
    CategoryComponent,
    ExpectationsComponent,
    AllocationComponent,
    CurrencyUnitPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ...PrimeModules,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    providePrimeNG({
      theme: {
        preset: LaraDarkBlue,
        options: {
          darkModeSelector: ".app-dark",
          cssLayer: {
            name: "primeng",
            order: "primeng, app-styles",
          },
        },
      },
    }),
    ...(environment.useMocks
      ? [
          { provide: AuthService, useExisting: MockAuthService },
          { provide: PortfolioService, useExisting: MockPortfolioService },
        ]
      : [
          provideFirebaseApp(() => initializeApp(config)),
          provideFirestore(() => getFirestore()),
          provideAuth(() => getAuth()),
        ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
