import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Config, IonicModule, ModalController, NavParams, Platform,
} from '@ionic/angular';
import {
  ConfigMock, ModalControllerMock, NavParamsMock, PlatformMock,
} from 'ionic-mocks';
import { MockComponent } from 'ng-mocks';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { ScreenOrientationMock } from '@shared/mocks/screen-orientation.mock';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { configureTestSuite } from 'ng-bullet';
import { ReverseLeftPopoverComponent } from '@pages/test-report/components/reverse-left-popover/reverse-left-popover';
import { ReverseLeftComponent } from '@pages/test-report/components/reverse-left/reverse-left';
import { VehicleChecksComponent } from '@pages/test-report/cat-c/components/vehicle-checks/vehicle-checks';
import { UncoupleRecoupleComponent } from '@pages/test-report/components/uncouple-recouple/uncouple-recouple';
import { ControlledStopComponent } from '../../components/controlled-stop/controlled-stop';
import { ManoeuvreCompetencyComponent } from '../../components/manoeuvre-competency/manoeuvre-competency';
import { EtaComponent } from '../../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../../components/legal-requirement/legal-requirement';
import { testReportReducer } from '../../test-report.reducer';
import { ToolbarComponent } from '../../components/toolbar/toolbar';
import { DrivingFaultSummaryComponent } from '../../components/driving-fault-summary/driving-fault-summary';
import { CompetencyButtonComponent } from '../../components/competency-button/competency-button';
import { CompetencyComponent } from '../../components/competency/competency';
import { TestReportCatCPage } from '../test-report.cat-c.page';
import { EcoComponent } from '../../components/eco/eco';

describe('TestReportCatCPage', () => {
  let fixture: ComponentFixture<TestReportCatCPage>;
  let component: TestReportCatCPage;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportCatCPage,
        MockComponent(ReverseLeftPopoverComponent),
        MockComponent(ReverseLeftComponent),
        MockComponent(TickIndicatorComponent),
        MockComponent(CompetencyComponent),
        MockComponent(CompetencyButtonComponent),
        MockComponent(LegalRequirementComponent),
        MockComponent(EtaComponent),
        MockComponent(DrivingFaultSummaryComponent),
        MockComponent(ToolbarComponent),
        MockComponent(ControlledStopComponent),
        MockComponent(ManoeuvreCompetencyComponent),
        MockComponent(VehicleChecksComponent),
        MockComponent(EcoComponent),
        MockComponent(PracticeModeBanner),
        MockComponent(UncoupleRecoupleComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forFeature('tests', () => (
          {
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                testData: initialState,
                journalData: {
                  candidate: candidateMock,
                },
              },
            },
          })),
        StoreModule.forFeature('testReport', testReportReducer),
      ],
      providers: [
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
        { provide: TestReportValidatorProvider, useClass: TestReportValidatorProviderMock },
        { provide: ScreenOrientation, useClass: ScreenOrientationMock },
        { provide: Insomnia, useClass: InsomniaMock },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReportCatCPage);
    component = fixture.componentInstance;
  });

  describe('DOM', () => {
    describe('Fault Modes Styling', () => {
      it('should not have any fault mode styles applied when serious and dangerous mode is disabled', () => {
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
      });
      it('should have serious fault mode styles applied when serious mode is enabled', () => {
        component.isSeriousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeDefined();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
      });
      it('should have dangerous fault mode styles applied when dangerous mode is enabled', () => {
        component.isDangerousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeDefined();
      });
    });
  });

  describe('End Test Button', () => {
    it('should call the end test function', () => {
      spyOn(component, 'onEndTestClick');
      const endTestButton = fixture.debugElement.query(By.css('#end-test-button'));
      endTestButton.triggerEventHandler('click', null);
      expect(component.onEndTestClick).toHaveBeenCalled();
    });
  });

});
