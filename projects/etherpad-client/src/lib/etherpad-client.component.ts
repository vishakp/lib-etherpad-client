import { Component, OnInit, Input } from '@angular/core';
import { EtherpadClientService } from './etherpad-client.service'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'ngx-etherpad-client',
  template: `
  <iframe *ngIf="enablePad" [src]="url" class="sharedDoc" referrerpolicy="same-origin"></iframe>
  <div *ngIf="loader" class="sharedDoc"></div>
  `,
  styles: [`
  .sharedDoc{
    position: absolute;
    z-index: 5;
    top: -5px;
    margin: 5px auto;
    width: calc(100% - 296px);
    height: calc(100% - 50px);
    background-color: #ffffff
    }
  `]
})
export class EtherpadClientComponent implements OnInit {
  host = ''
  @Input('chat') chat?:boolean;
  @Input('username') username: string;
  @Input('userId') userId:string;
  @Input('groupId') groupId:string;
  @Input('groupName') groupName: string
  url
  enablePad = false
  loader = true
  constructor(
    private etherPadService: EtherpadClientService,
    private sanitizer: DomSanitizer

  ) { 
    this.host = this.etherPadService.apiRoot
    if(!this.chat)
    this.chat = false
    this.etherPadService.getDocSession(this.username, this.userId, this.groupId, this.groupName)
      .then((res:any)=>{
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.host}p/${res.padId}?showChat=${this.chat}&userName=${this.username}`)
        this.enablePad = true
        this.loader = false
      })
  }

  ngOnInit() {
  }

}
