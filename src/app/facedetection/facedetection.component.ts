import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FacedetectionliveComponent } from "./facedetectionlive/facedetectionlive.component";

@Component({
    selector: 'app-facedetection',
    templateUrl: './facedetection.component.html',
    styleUrls: ['./facedetection.component.css']
})
export class FaceDetectionComponent implements OnInit {
    // Members Declarations
    rightMenusState: number = 2;
    rightMenusLiveState: number = 0;
    rightMenusSnapState: number = 0;
    @ViewChild('liveButton', { read: ElementRef }) liveButton!: ElementRef;
    @ViewChild('snapButton', { read: ElementRef }) snapButton!: ElementRef;
    @ViewChild(FacedetectionliveComponent) facedetectionlivecomponent!: FacedetectionliveComponent;

    ngOnInit():void {

    }

    startFaceDetLive(): void {
        this.facedetectionlivecomponent.start();
    }

    stopFaceDetLive(): void {
        this.facedetectionlivecomponent.stop();
    }


}