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
    @ViewChild('video-resolution') resolution_element!: ElementRef;

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
        let resolution: String;
        let resolution_vals: String[];
        //let constraints: { [id: string]: boolean, [id: number]: boolean } = {};
        let constraints: any;
        this.pc = this.createPeerConnection();

        constraints = { audio: false, video: false };
        resolution = this.resolution_element.nativeElement.value;

        if (resolution) {
            resolution_vals = resolution.split('x');
            constraints['video'] = {
                width: parseInt(resolution[0], 0),
                height: parseInt(resolution[1], 0)
            };
        } else {
            constraints.video = true;
        }

        if (constraints.audio || constraints.video) {
            if (constraints.video) {
                //document.getElementById('media').style.display = 'block';
            }
            navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
                stream.getTracks().forEach(function(track) {
                    //this.pc.addTrack(track, stream);
                });
                //return negotiate();
            }, function(err) {
                alert('Could not acquire media: ' + err);
            });
        } else {
            //negotiate();
        }
            

    }
}