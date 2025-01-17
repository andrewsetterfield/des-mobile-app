import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Observable } from 'rxjs';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';

interface CatCTestReportPageState {}
type TestReportPageState = CommonTestReportPageState & CatCTestReportPageState;

@Component({
  selector: '.test-report-cat-c-page',
  templateUrl: './test-report.cat-c.page.html',
  styleUrls: ['./test-report.cat-c.page.scss'],
})
export class TestReportCatCPage extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportPageState;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    modalController: ModalController,
    testReportValidatorProvider: TestReportValidatorProvider,
    screenOrientation: ScreenOrientation,
    insomnia: Insomnia,
    routeByCategory: RouteByCategoryProvider,
  ) {
    super(
      platform,
      authenticationProvider,
      router,
      store$,
      modalController,
      testReportValidatorProvider,
      screenOrientation,
      insomnia,
      routeByCategory,
    );
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<CatCUniqueTypes.TestData>,
    };
    this.setupSubscription();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();
  }

}
