import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JournalPageRoutingModule } from './journal-routing.module';

import { JournalPage } from './journal.page';
import { JournalService } from '../../services/journal/journal.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JournalPageRoutingModule
  ],
  declarations: [JournalPage],
  providers: [
    JournalService,
  ],
})
export class JournalPageModule {}
