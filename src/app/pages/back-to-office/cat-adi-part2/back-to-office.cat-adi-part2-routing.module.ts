import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackToOfficeCatAdiPart2Page } from './back-to-office.cat-adi-part2.page';

const routes: Routes = [
  {
    path: '',
    component: BackToOfficeCatAdiPart2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackToOfficeCatADIPart2PageRoutingModule {}