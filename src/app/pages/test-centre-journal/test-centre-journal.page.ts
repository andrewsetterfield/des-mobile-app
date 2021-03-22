import { Component } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { BasePageComponent } from '../../shared/classes/base-page';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { NetworkStateProvider } from '../../providers/network-state/network-state';
import { TestCentreJournalProvider } from '../../providers/test-centre-journal/test-centre-journal';
import { TestCentreDetailResponse } from '../../shared/models/test-centre-journal.model';
import { StoreModel } from '../../shared/models/store.model';
import { TestCentreJournalGetData, TestCentreJournalViewDidEnter } from './test-centre-journal.actions';
import { Log, LogType } from '../../shared/models/log.model';
import { LogHelper } from '../../providers/logs/logs-helper';
import { SaveLog } from '../../../store/logs/logs.actions';
import { AppComponent } from '../../app.component';
import {
  getLastRefreshed,
  getLastRefreshedTime,
} from '../../../store/test-centre-journal/test-centre-journal.selector';
import { getTestCentreJournalState } from '../../../store/test-centre-journal/test-centre-journal.reducer';
import { SetLastRefreshed } from '../../../store/test-centre-journal/test-centre-journal.actions';

interface TestCentreJournalPageState {
  isOffline$: Observable<boolean>;
  lastRefreshedTime$: Observable<string>;
}

@Component({
  selector: 'app-test-centre-journal',
  templateUrl: 'test-centre-journal.page.html',
  styleUrls: ['test-centre-journal.page.scss'],
})
export class TestCentreJournalPage extends BasePageComponent {

  pageState: TestCentreJournalPageState;
  testCentreResults: TestCentreDetailResponse = null;
  hasSearched: boolean = false;
  showSearchSpinner: boolean = false;
  subscription: Subscription = Subscription.EMPTY;
  didError: boolean = false;
  errorMessage: string = null;

  constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
    private networkStateProvider: NetworkStateProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
    private modalController: ModalController,
    private app: AppComponent,
    private testCentreJournalProvider: TestCentreJournalProvider,
  ) {
    super(platform, authenticationProvider, router);
  }

  ngOnInit() {
    this.pageState = {
      isOffline$: this.networkStateProvider.isOffline$,
      lastRefreshedTime$: this.store$.pipe(
        select(getTestCentreJournalState),
        map(getLastRefreshed),
        map(getLastRefreshedTime),
      ),
    };
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(TestCentreJournalViewDidEnter());
    this.getTestCentreData();
  }

  getTestCentreData = (): void => {
    this.subscription.unsubscribe();
    this.store$.dispatch(TestCentreJournalGetData());
    this.store$.dispatch(SetLastRefreshed({ lastRefreshed: new Date() }));
    this.showSearchSpinner = true;
    this.subscription = this.testCentreJournalProvider.getTestCentreJournal()
      .pipe(
        tap(() => { this.hasSearched = true; }),
        map((results: TestCentreDetailResponse) => {
          this.testCentreResults = results;
          this.showSearchSpinner = false;
          this.didError = false;
        }),
        catchError((err: HttpErrorResponse) => {
          const log: Log = this.logHelper.createLog(
            LogType.ERROR,
            'Getting test centre journal',
            err.message,
          );
          this.didError = true;
          this.store$.dispatch(SaveLog({ payload: log }));
          this.testCentreResults = null;
          this.showSearchSpinner = false;

          if (err) {
            this.mapError(err.error);
            this.hasSearched = false;
            return of();
          }

          this.hasSearched = true;
          return of(this.hasSearched);
        }),
      ).subscribe();
  };

  ionViewWillEnter() {
    super.ionViewWillEnter();
  }

  private mapError = (error: string): void => {
    if (error === undefined || error === '') return;
    this.errorMessage = error;
  };

}