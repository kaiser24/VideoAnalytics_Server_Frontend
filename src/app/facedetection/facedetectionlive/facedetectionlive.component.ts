import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RtcOfferDataModel } from "../../models/users.models";
import { ApiFaceDetectionService } from "../../services/apiHttp.service";

@Component({
  selector: 'app-facedetectionlive',
  templateUrl: './facedetectionlive.component.html',
  styleUrls: ['./facedetectionlive.component.css']
})
export class FacedetectionliveComponent {

  pc!: RTCPeerConnection;
  iceGatheringLog: string = 'iceGathering: ';
  iceConnectionLog: string = 'iceConnection: ';
  signalingLog: string = 'signaling: ';
  // DOM elements
  @ViewChild('video', { read: ElementRef }) video!:ElementRef;

  @Input() faceDetectionProcessState!: number;


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
          if (evt.track.kind == 'video')
              this.video.nativeElement.srcObject = evt.streams[0];
      }

      return pc;
  }

  // Negotiating between peers through the Signaling Server.
  // This mis the core of the RTC connection and it works like this:
  // pc object creates a local offer, this is the local description sdp. then
  // Waits for Ice to complete. Then sends the offer to the  other peers
  // through an endpoint on the signaling server, the other peer sends the answer sdp
  // and then use this sdp to set the remote description and complete the connection
  negotiate() {
      // Creates Offer sdp to set the local Description
      return this.pc.createOffer().then((offer) => {
          return this.pc.setLocalDescription(offer);
      }).then(() => {
      // wait for ICE gathering to complete
          return new Promise<void>((resolve) => {
              if (this.pc.iceGatheringState === 'complete') {
                  resolve();
              } else {
                  const checkState = () => {
                      if (this.pc.iceGatheringState === 'complete') {
                          this.pc.removeEventListener('icegatheringstatechange', checkState);
                          resolve();
                      }
                  }
                  this.pc.addEventListener('icegatheringstatechange', checkState);
              }
          });
      }).then(() => {
      // Codec filtering and sending the offer to the Signaling server which will pass
      // offer to the other peer
          let offer: RTCSessionDescription|null= this.pc.localDescription;
          let codec:string = 'default';
              
          if(codec !== 'default' ){
              console.log("not default");
              //offer!.sdp = this.sdpFilterCodec('video', codec, offer!.sdp);
          }

          let sdp:string = offer!.sdp as string;
          let type:string = offer!.type as string;
          let offerModel:RtcOfferDataModel = {sdp, type}
          // Sending the offer
          return this.apiFaceDetectionService.FaceDetectionStreamRequest(offerModel);
      }).then((answer) => {
      // Setting the remote Description once an answer is gotten
          this.pc.setRemoteDescription(answer);
          console.log("Connection completed");
      }).catch((e)=> {
      // Something went wrong
          console.log('Error trying to establish connection');
          alert(e);
      });
  }

  // Function to start The WebRTC connection process
  start() {
      (async () => {
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
              try { 
                  let stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints) ;
                  stream.getTracks().forEach( (track) => { this.pc.addTrack(track, stream) } );
              } catch (error) {
                  console.log(error);
              }
              await this.negotiate();                
          } else {
              this.negotiate();
          }    
  })();
  }

  stop(){
      // close transceivers
      if (this.pc.getTransceivers) {
          this.pc.getTransceivers().forEach((transceiver) => {
              if (transceiver.stop) {
                  transceiver.stop();
              }
          });
      }
  
      // close local audio / video
      this.pc.getSenders().forEach((sender) => {
          sender.track?.stop();
      });
  
      // close peer connection
      setTimeout(() => {
          this.pc.close();
      }, 500);
  }

  // Codec Filtering method. For when the default codecs are not selected.
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
