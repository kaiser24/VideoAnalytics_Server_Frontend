import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Constants } from '../config/constants';
import { LoginDataModel } from '../models/users.models';

@Injectable()
export class ApiLoginService {
    constructor(
        private http: HttpClient,
        private constants: Constants
    ) {}

    loginRequest(credentials: LoginDataModel){
        let body = new HttpParams({
            fromObject: credentials
        });
        this.http.post(this.constants.API_ENDPOINT+"/login",body)
        .subscribe( 
            response => { console.log(response);
            }, 
            error => { console.log(error);}
        );
    }
    
}
