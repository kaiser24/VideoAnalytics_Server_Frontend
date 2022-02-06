import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RtcOfferDataModel } from "../models/users.models";
import { ApiFaceDetectionService } from "../services/apiHttp.service";

@Component({
    selector: 'app-facedetection',
    templateUrl: './facedetection.component.html',
    styleUrls: ['./facedetection.component.css']
})
export class FaceDetectionComponent {
    // Members Declarations
    pc!: RTCPeerConnection;
    iceGatheringLog: string = 'iceGathering: ';
    iceConnectionLog: string = 'iceConnection: ';
    signalingLog: string = 'signaling: ';
    // DOM elements
    @ViewChild('video', { read: ElementRef }) video!:ElementRef;
    //@ViewChild('video-resolution') resolution_element!: ElementRef;
    //@ViewChild('video-codec') video_codec!: ElementRef;

    constructor(
        private apiFaceDetectionService: ApiFaceDetectionService
    ){}

    // Class Methods

    // Creating the peer connection and returns the peer connection object configured
    createPeerConnection():RTCPeerConnection {
        let config: any;
        //config= { sdpSemantics: 'unified-plan' };
        let pc = new RTCPeerConnection(  );

        pc.addEventListener('icegatheringstatechange', () => {
            this.iceGatheringLog = this.iceGatheringLog + ' -> ' + pc.iceGatheringState;
            console.log("Ice state gather: "+this.iceGatheringLog);
        }, false);
        this.iceGatheringLog = pc.iceGatheringState;

        pc.addEventListener('iceconnectionstatechange', () => {
            this.iceConnectionLog = this.iceConnectionLog + ' -> ' + pc.iceConnectionState;
            console.log("Ice state conn: "+this.iceGatheringLog);
        });
        this.iceConnectionLog = pc.iceConnectionState;

        pc.addEventListener('signalingstatechange', () => {
            this.signalingLog = this.signalingLog + ' -> ' + pc.signalingState;
            console.log("Signaling state: "+this.iceGatheringLog);
        });
        this.signalingLog = pc.signalingState;

        // Connect Audio / Video
        pc.ontrack = evt => {
            console.log("Track");    
            //if (evt.track.kind == 'video')
            //    this.video.nativeElement.setAttribute('src', evt.streams[0]);
        }

        return pc;
    }

    // Negotiating between peers through the Signaling Server
    negotiate() {
        return this.pc.createOffer().then((offer) => {
            console.log('THEN 1');
            console.log(offer);
            return this.pc.setLocalDescription(offer);
        }).then(() => {
            console.log('THEN 2');
            // wait for ICE gathering to complete
            return new Promise<void>((resolve) => {
                console.log('Starting ICE con');
                if (this.pc.iceGatheringState === 'complete') {
                    console.log('Starting ICE gath com,plete');
                    resolve();
                } else {
                    console.log('Starting ICE gath else');
                    const checkState = () => {
                        console.log('ICE state check');
                        if (this.pc.iceGatheringState === 'complete') {
                            console.log('ICE state check: complete');
                            this.pc.removeEventListener('icegatheringstatechange', checkState);
                            console.log('ICE state resolving');
                            resolve();
                        }
                    }
                    console.log('Starting ICE state event');
                    this.pc.addEventListener('icegatheringstatechange', checkState);
                }
            });
        }).then(() => {
            console.log('THEN 3');
            let offer: RTCSessionDescription|null= this.pc.localDescription;
            let codec:string = 'default';
                
            if(codec !== 'default' ){
                console.log("not default");
                //offer!.sdp = this.sdpFilterCodec('video', codec, offer!.sdp);
            }
    
            let sdp:string = offer!.sdp as string;
            let type:string = offer!.type as string;
            let offerModel:RtcOfferDataModel = {sdp, type}
            return this.apiFaceDetectionService.FaceDetectionStreamRequest(offerModel);

        }).then((answer) => {
            console.log('THEN 5');
            console.log(answer);
            this.pc.setRemoteDescription(answer);
        }).catch((e)=> {
            console.log('THEN 6 ERROR');
            alert(e);
        });
    }

    // Function to start Wertc connection process
    start() {
        (async () => {
            let resolution: string;
            let resolution_vals: string[];
            let constraints: any;
            this.pc = this.createPeerConnection();

            // Setting up parameters
            console.log("setting parameters");
            constraints = { audio: false, video: false };
            //resolution = this.resolution_element.nativeElement.value;
            resolution = "960x540";

            if (resolution) { 
                resolution_vals = resolution.split('x');
                constraints['video'] = {
                    width: parseInt(resolution[0], 0),
                    height: parseInt(resolution[1], 0)
                };
            } else {
                constraints.video = true;
            }

            // Getting user Media (Critic PArt. Still a bit confusing)
            if (constraints.audio || constraints.video) {   
                try { 
                    console.log("Getting user media");
                    let stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints) ;
                    stream.getTracks().forEach( (track) => { this.pc.addTrack(track, stream) } );
                    console.log("usermedia correctly loaded");
                } catch (error) {
                    console.log(error);
                }
                console.log("before netiation");
                await this.negotiate();
                console.log("after negotiation");
                
            } else {
                this.negotiate();
            }
            
    })();
    }

    sdpFilterCodec(kind:string, codec:string, realSdp:any) {
        var allowed:number[] = [];
        var rtxRegex:RegExp = new RegExp('a=fmtp:(\\d+) apt=(\\d+)\r$');
        var codecRegex:RegExp = new RegExp('a=rtpmap:([0-9]+) ' + this.escapeRegExp(codec))
        var videoRegex:RegExp = new RegExp('(m=' + kind + ' .*?)( ([0-9]+))*\\s*$')
        var lines:string[] = realSdp.split('\n');
        var isKind:boolean = false;

        for (var i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('m=' + kind + ' ') ){
                isKind = true;
            } else if (lines[i].startsWith('m=')){
                isKind = false;
            }

            if (isKind) {
                var match:RegExpMatchArray|null = lines[i].match(codecRegex);
                if (match) {
                    allowed.push(parseInt(match[1]));
                }

                match = lines[i].match(rtxRegex);
                if (match && allowed.includes(parseInt(match[2])) ){
                    allowed.push(parseInt(match[1]));
                }
            }
        }

        var skipRegex:RegExp = new RegExp('a=(fmtp|rtcp-fb|rtpmap):([0-9]+)');
        var sdp:string = '';

        isKind = false;
        for (var i = 0; i < allowed.length; i++) {
            if (lines[i].startsWith('m=' + kind + ' ')) {
                isKind = true;
            } else if (lines[i].startsWith('m=')) {
                isKind = false;
            }
    
            if (isKind) {
                var skipMatch:RegExpMatchArray|null = lines[i].match(skipRegex);
                if (skipMatch && !allowed.includes(parseInt(skipMatch[2]))) {
                    continue;
                } else if (lines[i].match(videoRegex)) {
                    sdp += lines[i].replace(videoRegex, '$1 ' + allowed.join(' ')) + '\n';
                } else {
                    sdp += lines[i] + '\n';
                }
            } else {
                sdp += lines[i] + '\n';
            }
        }
    
        return sdp;
    }

    escapeRegExp(string:string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
}