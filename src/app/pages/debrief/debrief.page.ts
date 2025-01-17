import { Platform } from '@ionic/angular';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { DebriefViewDidEnter, EndDebrief } from '@pages/debrief/debrief.actions';
import { merge, Observable, Subscription } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { getEco, getETA } from '@store/tests/test-data/common/test-data.selector';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Component } from '@angular/core';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { TranslateService } from '@ngx-translate/core';
import {
  CategoryCode, Eco, ETA, QuestionResult,
} from '@dvsa/mes-test-schema/categories/common';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { getTestOutcome } from '@pages/debrief/debrief.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';

import { TestOutcome } from '@shared/models/test-outcome';
import { Router } from '@angular/router';
import { DASHBOARD_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { getVehicleChecks } from '@store/tests/test-data/cat-c/test-data.cat-c.selector';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { isAnyOf } from '@shared/helpers/simplifiers';

interface DebriefPageState {
  seriousFaults$: Observable<string[]>;
  dangerousFaults$: Observable<string[]>;
  drivingFaults$: Observable<(FaultSummary)[]>;
  drivingFaultCount$: Observable<number>;
  etaFaults$: Observable<ETA>;
  ecoFaults$: Observable<Eco>;
  testResult$: Observable<string>;
  conductedLanguage$: Observable<string>;
  candidateName$: Observable<string>;
  category$: Observable<CategoryCode>;
  tellMeShowMeQuestions$: Observable<QuestionResult[]>;
}
@Component({
  selector: '.debrief-page',
  templateUrl: 'debrief.page.html',
  styleUrls: ['debrief.page.scss'],
})

export class DebriefPage extends PracticeableBasePageComponent {

  pageState: DebriefPageState;
  subscription: Subscription;
  isPassed: boolean;
  testCategory: TestCategory;

  // Used for now to test displaying pass/fail/terminated messages
  public outcome: string;

  public hasPhysicalEta: boolean = false;
  public hasVerbalEta: boolean = false;

  public adviceGivenControl: boolean = false;
  public adviceGivenPlanning: boolean = false;

  constructor(
    store$: Store<StoreModel>,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    public screenOrientation: ScreenOrientation,
    public insomnia: Insomnia,
    private translate: TranslateService,
    private faultCountProvider: FaultCountProvider,
    private faultSummaryProvider: FaultSummaryProvider,
    router: Router,
    protected routeByCategoryProvider: RouteByCategoryProvider,
    private testDataByCategoryProvider : TestDataByCategoryProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
  }

  ngOnInit(): void {
    super.ngOnInit();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );
    const testCategory$ = currentTest$.pipe(
      select(getTestCategory),
    );
    this.pageState = {
      seriousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(testCategory$),
        map(([data, category]) =>
          this.faultSummaryProvider.getSeriousFaultsList(data, category as TestCategory)
            .map((fault) => fault.competencyIdentifier)),
      ),
      dangerousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(testCategory$),
        map(([data, category]) =>
          this.faultSummaryProvider.getDangerousFaultsList(data, category as TestCategory)
            .map((fault) => fault.competencyIdentifier)),
      ),
      drivingFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(testCategory$),
        map(([data, category]) => this.faultSummaryProvider.getDrivingFaultsList(data, category as TestCategory)),
      ),
      drivingFaultCount$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(testCategory$),
        map(([testData, category]) =>
          this.faultCountProvider.getDrivingFaultSumCount(category as TestCategory, testData)),
      ),
      etaFaults$: currentTest$.pipe(
        select(getTestData),
        select(getETA),
      ),
      ecoFaults$: currentTest$.pipe(
        select(getTestData),
        select(getEco),
      ),
      testResult$: currentTest$.pipe(
        select(getTestOutcome),
      ),
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
      ),
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      category$: currentTest$.pipe(
        select(getTestCategory),
      ),
      tellMeShowMeQuestions$: currentTest$.pipe(
        withLatestFrom(testCategory$),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getVehicleChecks),
        map((checks) => [...checks.tellMeQuestions, ...checks.showMeQuestions]),
        map((checks) => checks.filter((c) => c.code !== undefined)),
      ),
    };

    const {
      testResult$, etaFaults$, ecoFaults$, conductedLanguage$, category$,
    } = this.pageState;

    this.subscription = merge(
      category$.pipe(map((result) => this.testCategory = result as TestCategory)),
      testResult$.pipe(map((result) => this.outcome = result)),
      etaFaults$.pipe(
        map((eta) => {
          this.hasPhysicalEta = eta.physical;
          this.hasVerbalEta = eta.verbal;
        }),
      ),
      ecoFaults$.pipe(
        map((eco) => {
          this.adviceGivenControl = eco.adviceGivenControl;
          this.adviceGivenPlanning = eco.adviceGivenPlanning;
        }),
      ),
      conductedLanguage$.pipe(tap((value) => configureI18N(value as Language, this.translate))),
    ).subscribe();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(DebriefViewDidEnter());
  }

  async ionViewDidLeave(): Promise<void> {
    super.ionViewDidLeave();

    if (this.isTestReportPracticeMode && super.isIos()) {
      this.screenOrientation.unlock();
      await this.insomnia.allowSleepAgain();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async endDebrief(): Promise<void> {
    if (this.isTestReportPracticeMode) {
      await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
      return;
    }
    this.store$.dispatch(EndDebrief());

    if (this.outcome === TestOutcome.PASS) {
      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.PASS_FINALISATION_PAGE, this.testCategory);
      return;
    }
    await this.router.navigate([TestFlowPageNames.POST_DEBRIEF_HOLDING_PAGE]);
  }

  isCategoryBTest(): boolean {
    return this.testCategory === TestCategory.B;
  }

  showVehicleChecksArrayCard(): boolean {
    return isAnyOf(this.testCategory, [
      // Cat BE
      TestCategory.BE,
      // Cat C
      TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
      // Cat D
      TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
      // Home
      TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K,
    ]);
  }

}
