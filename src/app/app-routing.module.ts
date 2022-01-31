import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginViewComponent } from './loginview/loginview.component';
import { FaceDetectionComponent } from './facedetection/facedetection.component';
import { AuthorizeGuard } from './services/authguard.service';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthorizeGuard]},
  {path: 'facedetection', component: FaceDetectionComponent},
  {path: 'login', component: LoginViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
