import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiLoginService } from '../services/apiHttp.service';
import { LoginDataModel } from '../models/users.models';
import { LocalStorageService } from '../services/localstorage.service';
import { Router } from '@angular/router';
import { AuthorizeGuard } from '../services/authguard.service';


@Component({
    selector: 'app-loginview',
    templateUrl: './loginview.component.html',
    styleUrls: ['./loginview.component.css']
})
export class LoginViewComponent {
    constructor(
        private loginService: ApiLoginService,
        private authStorageService: LocalStorageService,
        private authGuard: AuthorizeGuard,
        private router: Router
    ) {}

    login(form: NgForm){
        const username:string = form.value.username;
        const password:string = form.value.password;
        let credentials:LoginDataModel = {username, password}

        this.loginService.loginRequest( credentials )
        .subscribe(
            response => { 
                if( response.status == 200) {
                    this.authStorageService.set("token",response.token)
                    this.router.navigate(['/']);
                }else{
                    console.log("Wrong Credentials")
                }
             },
            err => { console.log(err); }
        );
        
    }
}