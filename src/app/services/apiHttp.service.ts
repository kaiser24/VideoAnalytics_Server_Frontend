import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Constants } from '../config/constants';
import { LoginDataModel } from '../models/users.models';
import { map } from 'rxjs/operators';

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
        return this.http.post<any>(this.constants.API_ENDPOINT+"/login",body)
        .pipe(
            map(response => ({
                token: response.token,
                status: 200
            }))
        );
    }
    
}
