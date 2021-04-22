import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { StoreModel } from '@shared/models/store.model';
import {
  CommonWaitingRoomPageState,
  WaitingRoomBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room/waiting-room-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';

interface CatHomeTestWaitingRoomPageState {}

type WaitingRoomPageState = CommonWaitingRoomPageState & CatHomeTestWaitingRoomPageState;

@Component({
  selector: 'app-waiting-room-cat-home-test',
  templateUrl: './waiting-room.cat-home-test.page.html',
  styleUrls: ['./waiting-room.cat-home-test.page.scss'],
})
export class WaitingRoomCatHomeTestPage extends WaitingRoomBasePageComponent implements OnInit {

  pageState = { ...this.commonPageState } as WaitingRoomPageState;

  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
    store$: Store<StoreModel>,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
  ) {
    super(store$, platform, authenticationProvider, router);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    return true;
  }

  ionViewDidLeave() {
    super.ionViewDidLeave();
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.COMMUNICATION_PAGE, TestCategory.H);
  }
}