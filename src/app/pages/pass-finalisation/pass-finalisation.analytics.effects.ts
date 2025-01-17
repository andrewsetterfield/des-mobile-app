import { Injectable } from '@angular/core';
import {
  Actions, createEffect, ofType,
} from '@ngrx/effects';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { switchMap, concatMap, withLatestFrom } from 'rxjs/operators';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import {
  AnalyticsScreenNames,
  AnalyticsErrorTypes,
  AnalyticsEventCategories,
  AnalyticsEvents,
} from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { getTests } from '@store/tests/tests.reducer';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { AnalyticRecorded, AnalyticNotRecorded } from '@providers/analytics/analytics.actions';
import * as passCompletionActions from '@store/tests/pass-completion/pass-completion.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as vehicleDetailsActions from '@store/tests/vehicle-details/vehicle-details.actions';
import { getActivityCode } from '@store/tests/activity-code/activity-code.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import * as commsActions from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { TestsModel } from '@store/tests/tests.model';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';
import * as passFinalisationActions from '@pages/pass-finalisation/pass-finalisation.actions';
import { ActivityCodes } from '@shared/models/activity-codes';
import {
  PassFinalisationViewDidEnter,
  PassFinalisationValidationError,
} from './pass-finalisation.actions';

@Injectable()
export class PassFinalisationAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  passFinalisationViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(PassFinalisationViewDidEnter),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([, tests]: [ReturnType<typeof PassFinalisationViewDidEnter>, TestsModel]) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.PASS_FINALISATION, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

  validationErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(PassFinalisationValidationError),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]: [ReturnType<typeof PassFinalisationValidationError>, TestsModel]) => {
      const formattedScreenName = formatAnalyticsText(AnalyticsScreenNames.PASS_FINALISATION, tests);
      this.analytics.logError(
        `${AnalyticsErrorTypes.VALIDATION_ERROR} (${formattedScreenName})`,
        action.errorMessage,
      );
      return of(AnalyticRecorded());
    }),
  ));

  code78PresentEffect$ = createEffect(() => this.actions$.pipe(
    ofType(passCompletionActions.Code78Present),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof passCompletionActions.Code78Present>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_CODE_78, tests),
        'Yes',
      );
      return of(AnalyticRecorded());
    }),
  ));

  code78NotPresentEffect$ = createEffect(() => this.actions$.pipe(
    ofType(passCompletionActions.Code78NotPresent),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof passCompletionActions.Code78NotPresent>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_CODE_78, tests),
        'No',
      );
      return of(AnalyticRecorded());
    }),
  ));

  provisionalLicenseNotReceived$ = createEffect(() => this.actions$.pipe(
    ofType(passCompletionActions.ProvisionalLicenseNotReceived),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof passCompletionActions.ProvisionalLicenseNotReceived>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LICENSE_RECEIVED, tests),
        'No',
      );
      return of(AnalyticRecorded());
    }),
  ));

  provisionalLicenseReceived$ = createEffect(() => this.actions$.pipe(
    ofType(passCompletionActions.ProvisionalLicenseReceived),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof passCompletionActions.ProvisionalLicenseReceived>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LICENSE_RECEIVED, tests),
        'Yes',
      );
      return of(AnalyticRecorded());
    }),
  ));

  transmissionChanged$ = createEffect(() => this.actions$.pipe(
    ofType(vehicleDetailsActions.GearboxCategoryChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getActivityCode),
        ),
      ),
    )),
    concatMap(([action, tests, activityCode]:
    [ReturnType<typeof vehicleDetailsActions.GearboxCategoryChanged>, TestsModel, ActivityCode]) => {
      if (activityCode != null) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.GEARBOX_CATEGORY_CHANGED, tests),
          action.gearboxCategory,
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  d255Yes$ = createEffect(() => this.actions$.pipe(
    ofType(testSummaryActions.D255Yes),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof testSummaryActions.D255Yes>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.D255, tests),
        'Yes',
      );
      return of(AnalyticRecorded());
    }),
  ));

  d255No$ = createEffect(() => this.actions$.pipe(
    ofType(testSummaryActions.D255No),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof testSummaryActions.D255No>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.D255, tests),
        'No',
      );
      return of(AnalyticRecorded());
    }),
  ));

  candidateChoseToProceedWithTestInEnglish$ = createEffect(() => this.actions$.pipe(
    ofType(commsActions.CandidateChoseToProceedWithTestInEnglish),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getActivityCode),
        ),
      ),
    )),
    concatMap(([, tests, activityCode]:
    [ReturnType<typeof commsActions.CandidateChoseToProceedWithTestInEnglish>, TestsModel, ActivityCode]) => {
      if (activityCode !== null) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.LANGUAGE_CHANGED, tests),
          Language.ENGLISH,
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  candidateChoseToProceedWithTestInWelsh$ = createEffect(() => this.actions$.pipe(
    ofType(commsActions.CandidateChoseToProceedWithTestInWelsh),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getActivityCode),
        ),
      ),
    )),
    concatMap(([, tests, activityCode]:
    [ReturnType<typeof commsActions.CandidateChoseToProceedWithTestInWelsh>, TestsModel, ActivityCode]) => {
      if (activityCode !== null) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.LANGUAGE_CHANGED, tests),
          Language.CYMRAEG,
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  passFinalisationReportActivityCode$ = createEffect(() => this.actions$.pipe(
    ofType(
      passFinalisationActions.PassFinalisationReportActivityCode,
    ),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([{ activityCode }, tests]:
    [ReturnType <typeof passFinalisationActions.PassFinalisationReportActivityCode>, TestsModel]) => {
      const [description, code] = getEnumKeyByValue(ActivityCodes, activityCode);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.SET_ACTIVITY_CODE, tests),
        `${code} - ${description}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
