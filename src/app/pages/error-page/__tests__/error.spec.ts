import {
  ComponentFixture, waitForAsync, TestBed, fakeAsync,
} from '@angular/core/testing';
import {
  NavParamsMock, ConfigMock, AlertControllerMock,
} from 'ionic-mocks';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import {
  AlertController, Config, IonicModule, ModalController, NavParams,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { ErrorMessageComponent } from '@components/common/error-message/error-message';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ErrorPage } from '../error';

describe('ErrorPage', () => {
  let fixture: ComponentFixture<ErrorPage>;
  let component: ErrorPage;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ErrorPage,
        MockComponent(ErrorMessageComponent),
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        { provide: Router, useFactory: () => {} },
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ErrorPage);
    component = fixture.componentInstance;
  }));

  describe('dismiss', () => {
    it('should dismiss open modal', fakeAsync(async () => {
      spyOn(component.modalController, 'dismiss');
      await component.dismiss();
      expect(component.modalController.dismiss).toHaveBeenCalled();
    }));
  });

  describe('DOM', () => {
    it('should display an error message', () => {
      expect(fixture.debugElement.query(By.css('.error'))).not.toBeNull();
    });
  });
});
