import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { EtherpadClientComponent } from './etherpad-client.component';
import { HttpClientModule } from '@angular/common/http'
@NgModule({
  declarations: [EtherpadClientComponent],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [EtherpadClientComponent]
})
export class EtherpadClientModule { }
