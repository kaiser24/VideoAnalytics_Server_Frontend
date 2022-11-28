import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
    public readonly API_ENDPOINT: string = 'https://192.168.1.1:4000/api';
    public static TitleOfSite: string = "Gnosis";
}