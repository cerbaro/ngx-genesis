import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CamerasRoutingModule } from './cameras-routing.module';
import { CamerasComponent } from './cameras/cameras.component';

@NgModule({
  imports: [
    CommonModule,
    CamerasRoutingModule
  ],
  declarations: [CamerasComponent]
})
export class CamerasModule { }
