import { Observable, merge, Subscription } from 'rxjs';
import { BasePageComponent } from '@shared/classes/base-page';
import { CategoryCode, JournalData } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Action, select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Router } from '@angular/router';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { DeviceProvider } from '@providers/device/device';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { JournalDataUnion } from '@shared/unions/journal-union';
import { AppComponent } from '../../app.component';
import {
  getInsuranceDeclarationStatus,
  getResidencyDeclarationStatus, getSignatureStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { getTests } from '@store/tests/tests.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber, getCandidateName,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { CAT_B, ERROR_PAGE, getPageNameByCategoryAndKey, LOGIN_PAGE } from '@pages/page-names.constants';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { ErrorTypes } from '@shared/models/error-message';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getTestSlotAttributes } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';
import { map, tap } from 'rxjs/operators';
import { isWelshTest } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { getPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { isEmpty } from 'lodash';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { WaitingRoomValidationError, WaitingRoomViewDidEnter } from '@pages/waiting-room/waiting-room.actions';
import {
  SignatureDataChanged,
  SignatureDataCleared, ToggleInsuranceDeclaration, ToggleResidencyDeclaration,
} from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { getTestCategory } from '@store/tests/category/category.reducer';

interface WaitingRoomPageState {
  insuranceDeclarationAccepted$: Observable<boolean>;
  residencyDeclarationAccepted$: Observable<boolean>;
  signature$: Observable<string>;
  candidateName$: Observable<string>;
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  welshTest$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
  category$: Observable<CategoryCode>;
}

@Component({
  selector: 'waiting-room-page',
  templateUrl: 'waiting-room-page.html',
  styleUrls: ['waiting-room-page.scss'],
})
export class WaitingRoomPage extends BasePageComponent {

  // @ViewChild(Navbar) navBar: Navbar;

  pageState: WaitingRoomPageState;

  formGroup: FormGroup;

  subscription: Subscription;

  merged$: Observable<boolean | string | JournalDataUnion>;

  categoryCode: CategoryCode;

  constructor(
    public store$: Store<StoreModel>,
    public router: Router,
    public navParams: NavParams,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    private deviceAuthenticationProvider: DeviceAuthenticationProvider,
    private deviceProvider: DeviceProvider,
    // private screenOrientation: ScreenOrientation,
    // private insomnia: Insomnia,
    private translate: TranslateService,
    private modalController: ModalController,
    private appComponent: AppComponent,
  ) {
    super(platform, authenticationProvider, router);
    this.formGroup = new FormGroup({});
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(WaitingRoomViewDidEnter());

    if (super.isIos()) {
      // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
      // this.insomnia.keepAwake();
      this.deviceProvider.enableSingleAppMode();
    }

    // this.navBar.backButtonClick = (e: UIEvent) => {
    //   this.clickBack();
    // };
  }

  clickBack(): void {
    this.deviceAuthenticationProvider.triggerLockScreen()
      .catch((err) => {
        console.log(err);
      });
  }

  ngOnInit(): void {

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      insuranceDeclarationAccepted$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getInsuranceDeclarationStatus),
      ),
      residencyDeclarationAccepted$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getResidencyDeclarationStatus),
      ),
      signature$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getSignatureStatus),
      ),
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateName),
      ),
      candidateUntitledName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      candidateDriverNumber$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateDriverNumber),
        map(formatDriverNumber),
      ),
      welshTest$: currentTest$.pipe(
        select(getJournalData),
        select(getTestSlotAttributes),
        select(isWelshTest),
      ),
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
      ),
      category$: currentTest$.pipe(
        select(getTestCategory),
      ),
    };
    const { welshTest$, category$, conductedLanguage$ } = this.pageState;
    this.merged$ = merge(
      currentTest$.pipe(
        select(getJournalData),
        tap((journalData: JournalData) => {
          if (this.isJournalDataInvalid(journalData)) {
            this.showCandidateDataMissingError();
          }
        }),
      ),
      welshTest$,
      category$.pipe(tap(value => this.categoryCode = value)),
      conductedLanguage$.pipe(tap(value => configureI18N(value as Language, this.translate))),
    );
  }

  ionViewWillEnter(): boolean {
    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }

    return true;
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isJournalDataInvalid = (journalData: JournalData): boolean => {
    return isEmpty(journalData.examiner.staffNumber) ||
      (isEmpty(journalData.candidate.candidateName) && isEmpty(journalData.candidate.driverNumber));
  }

  getSignatureDrawCompleteAction(): Action {
    return SignatureDataChanged;
  }

  getSignatureClearAction(): Action {
    return SignatureDataCleared;
  }

  insuranceDeclarationChanged(): void {
    this.store$.dispatch(ToggleInsuranceDeclaration());
  }

  residencyDeclarationChanged(): void {
    this.store$.dispatch(ToggleResidencyDeclaration());
  }

  dispatchCandidateChoseToProceedInWelsh() {
    this.store$.dispatch(CandidateChoseToProceedWithTestInWelsh(Language.CYMRAEG));
  }

  dispatchCandidateChoseToProceedInEnglish() {
    this.store$.dispatch(CandidateChoseToProceedWithTestInEnglish(Language.ENGLISH));
  }

  onSubmit() {
    Object.keys(this.formGroup.controls).forEach(controlName => this.formGroup.controls[controlName].markAsDirty());
    if (this.formGroup.valid) {
      this.router.navigate([getPageNameByCategoryAndKey(this.categoryCode as TestCategory, 'COMMUNICATION_PAGE')]);
    } else {
      Object.keys(this.formGroup.controls).forEach((controlName) => {
        if (this.formGroup.controls[controlName].invalid) {
          this.store$.dispatch(WaitingRoomValidationError(`${controlName} is blank`));
        }
      });
    }
  }

  showCandidateDataMissingError() {
    // Modals are at the same level as the ion-nav so are not getting the zoom level class,
    // this needs to be passed in the create options.
    const zoomClass = `modal-fullscreen ${this.appComponent.getTextZoomClass()}`;

    // const errorModal = this.modalController.create(
    //   ERROR_PAGE,
    //   { type: ErrorTypes.JOURNAL_DATA_MISSING },
    //   { cssClass: zoomClass });
    // errorModal.present();
    // errorModal.onDidDismiss(() => this.navController.setRoot(LOGIN_PAGE));
  }

}
