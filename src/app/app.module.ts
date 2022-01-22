import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavBarComponent } from './home/navbar/navbar.component';
import { MainMenuComponent } from './home/main_menu/main_menu.component';
import { HomeComponent } from './home/home.component';
import { LoginViewComponent } from './loginview/loginview.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
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
