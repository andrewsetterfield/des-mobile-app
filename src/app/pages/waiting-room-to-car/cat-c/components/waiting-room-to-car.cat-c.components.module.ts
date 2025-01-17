import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  VehicleChecksModalCatCModule,
} from '@pages/waiting-room-to-car/cat-c/components/vehicle-checks-modal/vehicle-checks-modal.cat-c.page.module';
import { VehicleChecksCatCComponent } from './vehicle-checks/vehicle-checks.cat-c';

@NgModule({
  declarations: [
    VehicleChecksCatCComponent,
  ],
  imports: [
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    VehicleChecksModalCatCModule,
  ],
  exports: [
    VehicleChecksCatCComponent,
  ],
})
export class WaitingRoomToCarCatCComponentsModule { }
