import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

@Component({
    selector: 'app-facedetection',
    templateUrl: './facedetection.component.html',
    styleUrls: ['./facedetection.component.css']
})
export class FaceDetectionComponent {
    // Members Declarations
    pc!: RTCPeerConnection;
    iceGatheringLog: String = 'iceGathering: ';
    iceConnectionLog: String = 'iceConnection: ';
    signalingLog: String = 'signaling: ';
    // DOM elements
    @ViewChild('video') video!: ElementRef;

    // Class Methods
    createPeerConnection():RTCPeerConnection {
        let config: any;
        config= { sdpSemantics: 'unified-plan' };
        let pc = new RTCPeerConnection( config );

        pc.addEventListener('icegatheringstatechange', () => {
            this.iceGatheringLog = this.iceGatheringLog + ' -> ' + pc.iceGatheringState;
        }, false);
        this.iceGatheringLog = pc.iceGatheringState;

        pc.addEventListener('iceconnectionstatechange', () => {
            this.iceConnectionLog = this.iceConnectionLog + ' -> ' + pc.iceConnectionState;
        });
        this.iceConnectionLog = pc.iceConnectionState;

        pc.addEventListener('signalingstatechange', () => {
            this.signalingLog = this.signalingLog + ' -> ' + pc.signalingState;
        });
        this.signalingLog = pc.signalingState;

        // Connect Audio / Video
        pc.addEventListener('track', (evt) => {
            if (evt.track.kind == 'video')
                this.video.nativeElement.setAttribute('srcObject', evt.streams[0]);

        });

        return pc;
    }

    start() {
        this.pc = this.createPeerConnection();

    }
}