import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
    public readonly API_ENDPOINT: string = 'https://192.168.1.5:4000/';
    public static TitleOfSite: string = "Gnosis";
}