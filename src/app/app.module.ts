import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavBarComponent } from './navbar/navbar.component';
import { FaceDetectionComponent } from './facedetection/facedetection.component';
import { MainMenuComponent } from './home/main_menu/main_menu.component';
import { HomeComponent } from './home/home.component';
import { LoginViewComponent } from './loginview/loginview.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FaceDetectionComponent,
    MainMenuComponent,
    HomeComponent,
    LoginViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
