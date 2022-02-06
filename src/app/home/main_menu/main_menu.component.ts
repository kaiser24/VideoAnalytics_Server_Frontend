import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-main_menu',
    templateUrl: './main_menu.component.html',
    styleUrls: ['./main_menu.component.css']
})
export class MainMenuComponent {
    constructor(private router: Router) {}

    navigatetoFacedetection(): void {
        console.log("Selected Facedetection");
        this.router.navigate(["/facedetection"]);
    }

}
