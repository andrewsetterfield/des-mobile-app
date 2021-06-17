import {
  Component, Output, EventEmitter, Input,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { VRNCaptureModal } from '@components/common/vrn-capture-modal/vrn-capture-modal';
import { StoreModel } from '@shared/models/store.model';
import { VehicleRegistrationChanged } from '@store/tests/vehicle-details/vehicle-details.actions';

@Component({
  selector: 'candidate-section',
  templateUrl: './candidate-section.html',
  styleUrls: ['./candidate-section.scss'],
})
export class CandidateSectionComponent {

  constructor(
    public modalController: ModalController,
    public store$: Store<StoreModel>,
  ) {
  }

  @Input()
  candidateName: string;

  @Input()
  candidateDriverNumber: string;

  @Output()
  continueClickEvent = new EventEmitter<boolean>();

  vrnModal: HTMLIonModalElement;

  proceed(): void {
    this.continueClickEvent.emit(true);
  }

  async openVRNModal(): Promise<void> {
    this.vrnModal = await this.modalController.create({
      id: 'VRNCaptureModal',
      component: VRNCaptureModal,
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        onCancel: this.onCancel,
        onSave: this.onSave,
      },
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await this.vrnModal.present();
  }

  onCancel = async (): Promise<void> => {
    await this.vrnModal.dismiss();
  };

  onSave = async (value): Promise<void> => {
    this.store$.dispatch(VehicleRegistrationChanged(value));
    await this.vrnModal.dismiss();
  };
}
