/// <reference path="../../node_modules/anychart/dist/index.d.ts"/>

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
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
import { AllocationComponent } from "./allocation/allocation.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CategoryComponent } from "./category/category.component";
import { ChartPageComponent } from "./chart-page/chart-page.component";
import { ExpectationsComponent } from "./expectations/expectations.component";
import { TablePageComponent } from "./table-page/table-page.component";

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ...PrimeModules,
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
