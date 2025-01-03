/// <reference path="../../node_modules/anychart/dist/index.d.ts"/>

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ConfirmationService, MessageService, SharedModule } from "primeng/api";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { ButtonGroupModule } from "primeng/buttongroup";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { MessagesModule } from "primeng/messages";
import { MultiSelectModule } from "primeng/multiselect";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SelectButtonModule } from "primeng/selectbutton";
import { SidebarModule } from "primeng/sidebar";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AllocationComponent } from "./components/allocation/allocation.component";
import { CategoryComponent } from "./components/category/category.component";
import { ChartPageComponent } from "./components/chart-page/chart-page.component";
import { ExpectationsComponent } from "./components/expectations/expectations.component";
import { TablePageComponent } from "./components/table-page/table-page.component";
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
  SidebarModule,
  TooltipModule,
  ButtonModule,
  MenuModule,
  ProgressSpinnerModule,
  InputSwitchModule,
  SelectButtonModule,
  TableModule,
  MultiSelectModule,
  TagModule,
  ButtonGroupModule,
  DialogModule,
  DropdownModule,
  ConfirmDialogModule,
  InputTextModule,
  InputNumberModule,
  FloatLabelModule,
  MessagesModule,
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
    provideFirebaseApp(() => initializeApp(config)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
