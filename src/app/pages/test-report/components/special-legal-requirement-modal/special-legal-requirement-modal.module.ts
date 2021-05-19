import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SpecialLegalRequirementModal } from './special-legal-requirement-modal';
import { ComponentsModule } from '@components/common/common-components.module';

@NgModule({
  declarations: [
    SpecialLegalRequirementModal,
  ],
  imports: [
    ComponentsModule,
    IonicModule,
  ],
  exports: [
    SpecialLegalRequirementModal,
  ],
})
export class SpecialLegalRequirementModalModule { }
