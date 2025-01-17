import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';
import { configureTestSuite } from 'ng-bullet';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ComponentsModule } from '@components/common/common-components.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('FinishTestModal', () => {
  let modalFixture: ComponentFixture<FinishTestModal>;
  let modalComponent: FinishTestModal;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        FinishTestModal,
      ],
      imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });
  });
  beforeEach(waitForAsync(() => {
    modalFixture = TestBed.createComponent(FinishTestModal);
    modalComponent = modalFixture.componentInstance;
    spyOn(modalComponent.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
    modalComponent.completeTest = jasmine.createSpy('completeTest');
  }));

  describe('onCompleteTest', () => {
    it('expect completeTest to be called', async () => {
      await modalComponent.onCompleteTest();
      expect(modalComponent.completeTest).toHaveBeenCalled();
    });
  });

  describe('onBack', () => {
    it('expect completeTest to be called', async () => {
      await modalComponent.onBack();
      expect(modalComponent.modalController.dismiss).toHaveBeenCalled();
    });
  });
});
