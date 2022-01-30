// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { NavBarComponent } from './navbar/navbar.component';
import { FaceDetectionComponent } from './facedetection/facedetection.component';
import { MainMenuComponent } from './home/main_menu/main_menu.component';
import { HomeComponent } from './home/home.component';
import { LoginViewComponent } from './loginview/loginview.component';

// Services
import { Constants } from './config/constants';
import { ApiLoginService } from './services/apiHttp.service';

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
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    Constants,
    HttpClient,
    ApiLoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
