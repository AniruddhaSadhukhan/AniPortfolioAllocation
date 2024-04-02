/// <reference path="../../node_modules/anychart/dist/index.d.ts"/>

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ChartPageComponent } from "./chart-page/chart-page.component";
import { TablePageComponent } from "./table-page/table-page.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule } from "@angular/material/menu";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { CategoryComponent } from "./category/category.component";
import { ExpectationsComponent } from "./expectations/expectations.component";
import { AllocationComponent } from "./allocation/allocation.component";
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';

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
  MenuModule
]

const AngularMaterial = [
  MatToolbarModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatTooltipModule,
  MatIconModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatMenuModule,
  MatSelectModule,
  MatChipsModule,
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
    ...AngularMaterial,
    ...PrimeModules,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
