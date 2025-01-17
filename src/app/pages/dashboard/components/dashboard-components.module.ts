import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PracticeTestModal } from '@pages/dashboard/components/practice-test-modal/practice-test-modal';
import { ProfileHeaderComponent } from './profile-header/profile-header';
import { RekeySearchCardComponent } from './rekey-search-card/rekey-search-card';
import { GoToJournalCardComponent } from './go-to-journal-card/go-to-journal-card';
import { TestResultsSearchCardComponent } from './test-results-search-card/test-results-search-card';
import { PracticeEndToEndCardComponent } from './practice-end-to-end-card/practice-end-to-end-card';
import { PracticeTestReportCardComponent } from './practice-test-report-card/practice-test-report-card';
import { TestCentreJournalCardComponent } from './test-centre-journal-card/test-centre-journal-card';

@NgModule({
  declarations: [
    ProfileHeaderComponent,
    GoToJournalCardComponent,
    RekeySearchCardComponent,
    PracticeEndToEndCardComponent,
    TestResultsSearchCardComponent,
    PracticeTestReportCardComponent,
    TestCentreJournalCardComponent,
    PracticeTestModal,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    ProfileHeaderComponent,
    GoToJournalCardComponent,
    RekeySearchCardComponent,
    PracticeEndToEndCardComponent,
    TestResultsSearchCardComponent,
    PracticeTestReportCardComponent,
    TestCentreJournalCardComponent,
    PracticeTestModal,
  ],
})

export class DashboardComponentsModule { }
