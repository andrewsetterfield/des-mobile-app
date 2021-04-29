import { NgModule } from '@angular/core';
import { ConductedLanguageComponent } from './conducted-language/conducted-language';
import { InsuranceDeclarationComponent } from './insurance-declaration/insurance-declaration';
import { TranslateModule } from '@ngx-translate/core';
import { ResidencyDeclarationComponent } from './residency-declaration/residency-declaration';
import { SignatureComponent } from './signature/signature';
import { CBTNumberComponent } from './cbt-number/cbt-number';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    ConductedLanguageComponent,
    InsuranceDeclarationComponent,
    ResidencyDeclarationComponent,
    SignatureComponent,
    CBTNumberComponent,
  ],
  imports: [
    IonicModule,
    TranslateModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    ConductedLanguageComponent,
    InsuranceDeclarationComponent,
    ResidencyDeclarationComponent,
    SignatureComponent,
    CBTNumberComponent,
  ],
})
export class WaitingRoomComponentsModule { }
