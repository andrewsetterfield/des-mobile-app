import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'test-finalisation-invalid-test-data-modal',
  templateUrl: 'test-finalisation-invalid-test-data-modal.html',
  styleUrls: ['test-finalisation-invalid-test-data-modal.scss'],
})
export class TestFinalisationInvalidTestDataModal {

  onCancel: Function;
  onReturnToTestReport: Function;

  constructor(
    private navParams: NavParams,
  ) {
    this.onCancel = this.navParams.get('onCancel');
    this.onReturnToTestReport = this.navParams.get('onReturnToTestReport');
  }

}
