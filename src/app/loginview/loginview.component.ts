import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiLoginService } from '../services/apiHttp.service';
import { LoginDataModel } from '../models/users.models';


@Component({
    selector: 'app-loginview',
    templateUrl: './loginview.component.html',
    styleUrls: ['./loginview.component.css']
})
export class LoginViewComponent {
    constructor(private api_login: ApiLoginService) {}

    login(form: NgForm){
        const username:string = form.value.username;
        const password:string = form.value.password;
        let credentials:LoginDataModel = {username, password}

        this.api_login.loginRequest( credentials )
        .subscribe(
            response => { console.log(response) },
            err => { console.log(err); }
        );
    }
}