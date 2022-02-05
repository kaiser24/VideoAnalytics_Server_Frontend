import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Constants } from '../config/constants';
import { LoginDataModel, RtcOfferDataModel } from '../models/users.models';
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
        return this.http.post<any>(this.constants.API_ENDPOINT+"/login",body).toPromise();
    }
    
}

@Injectable()
export class ApiFaceDetectionService {
    constructor(
        private http: HttpClient,
        private constants: Constants
    ) {}

    FaceDetectionStreamRequest(rtcoffer: RtcOfferDataModel) {
        let body = new HttpParams({
            fromObject: rtcoffer
        });
        return this.http.post<any>(this.constants.API_ENDPOINT+"/process/facerecognition/stream", body).toPromise();
    }
}
