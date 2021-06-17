import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import {
  FieldValidators,
  getRegistrationNumberValidator,
} from '@shared/constants/field-validators/field-validators';

@Component({
  selector: 'vrn-capture-modal',
  templateUrl: './vrn-capture-modal.html',
  styleUrls: ['./vrn-capture-modal.scss'],
})
export class VRNCaptureModal {

  onCancel: Function;

  onSave: Function;

  vehicleRegistration: string;

  formGroup: FormGroup;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    private navParams: NavParams,
  ) {
    this.onCancel = this.navParams.get('onCancel');
    this.onSave = this.navParams.get('onSave');
    this.formGroup = new FormGroup({});
    this.formGroup.addControl(
      'vehicleRegistration', new FormControl(
        null, [
          Validators.required,
          Validators.pattern(/[A-Z0-9]{1,7}$/gi),
          Validators.maxLength(parseInt(getRegistrationNumberValidator().maxLength, 10)),
        ],
      ),
    );
  }

  vehicleRegistrationChanged(vehicleRegistration): void {
    this.vehicleRegistration = vehicleRegistration;
  }

  validateAndSave(): void {
    if (/[A-Z0-9]{1,7}$/gi.test(this.vehicleRegistration)) {
      this.onSave(this.vehicleRegistration);
    }
  }

}
