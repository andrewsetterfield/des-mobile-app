import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import {
  JournalEarlyStartModalMock,
} from '@pages/journal/components/journal-early-start-modal/__mocks__/journal-early-start-modal.mock';
import { NavParamsMock } from '@pages/journal/components/journal-early-start-modal/__mocks__/nav-params.mock';
import { ConfirmSubmitModal } from '../confirm-submit-modal';

describe('submitModal', () => {
  let modalFixture: ComponentFixture<ConfirmSubmitModal>;
  let modalComponent: ConfirmSubmitModal;
  const mockFile: JournalEarlyStartModalMock = new JournalEarlyStartModalMock();
  const navMock: NavParamsMock = new NavParamsMock();

  configureTestSuite(() => {
    jasmine.getEnv().allowRespy(true);
    TestBed.configureTestingModule({
      declarations: [
        ConfirmSubmitModal,
      ],
      imports: [
        RouterTestingModule,
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: NavParams, useFactory: () => navMock },
        provideMockStore({}),
      ],
    });
  });
  beforeEach(waitForAsync(() => {
    const mockValue = mockFile.mockSlotDetail();
    spyOn(navMock, 'get').and.returnValue(mockValue);
    modalFixture = TestBed.createComponent(ConfirmSubmitModal);
    modalComponent = modalFixture.componentInstance;
    spyOn(modalComponent.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
  }));

  it('should call onBack when the Cancel button is clicked', async () => {
    spyOn(modalComponent.modalController, 'dismiss');
    const button = modalFixture.debugElement.query(By.css('#cancel-button'));
    button.triggerEventHandler('click', null);
    modalFixture.detectChanges();
    await modalComponent.onBack();
    expect(modalComponent.modalController.dismiss).toHaveBeenCalled();
  });

  it('should call onCompleteTest when the Submit button is clicked', () => {
    modalComponent.onTestDetailsConfirm = async () => {};
    modalFixture.detectChanges();
    spyOn(modalComponent, 'onCompleteTest').and.callThrough();
    const button = modalFixture.debugElement.query(By.css('#continue-button'));
    button.triggerEventHandler('click', null);
    modalFixture.detectChanges();
    expect(modalComponent.onCompleteTest).toHaveBeenCalled();
  });
});
