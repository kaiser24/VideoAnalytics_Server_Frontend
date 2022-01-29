import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

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
    @ViewChild('video') video!: ElementRef;
    //@ViewChild('video-resolution') resolution_element!: ElementRef;
    //@ViewChild('video-codec') video_codec!: ElementRef;

    // Class Methods

    // Creating the peer connection and returns the peer connection object configured
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

    // Negotiating between peers through the Signaling Server
    negotiate(){
        async () => {
            // Need to create the RTC offer, then . 
            try{
                let offer: RTCLocalSessionDescriptionInit = await this.pc.createOffer();
                this.pc.setLocalDescription(offer);
                await new Promise<void>( (resolve) => {
                    if (this.pc.iceGatheringState === 'complete'){
                        resolve();
                    } else {
                        // Will this work?
                        this.pc.onicegatheringstatechange = ev => {
                            if (this.pc.iceGatheringState === 'complete'){
                                resolve();
                            }
                        };
                    }
                });

                let codec:string = 'default';
                
                if(codec !== 'default' ){
                    offer.sdp = this.sdpFilterCodec('video', codec, offer.sdp);
                }

                // TODO: SDP offer petition.


            }catch (e) {

            }
            
        }

        
    }
    
    // Function to start Wertc connection process
    start() {
        let resolution: string;
        let resolution_vals: string[];
        let constraints: any;
        this.pc = this.createPeerConnection();

        // Setting up parameters
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

            async function getMedia(pc: RTCPeerConnection){ 
                try { 
                    let stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints) ;
                    stream.getTracks().forEach( (track) => { pc.addTrack(track, stream) } );
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            this.negotiate();
        }
            

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