import { By } from '@angular/platform-browser';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { VehicleChecksToggleComponent } from '../vehicle-checks-completed';
import { AppModule } from '../../../../../app.module';

describe('VehicleChecksToggleComponent', () => {
  let fixture: ComponentFixture<VehicleChecksToggleComponent>;
  let component: VehicleChecksToggleComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksToggleComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleChecksToggleComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  }));

  describe('DOM', () => {
    it('should call VehicleChecksToggleResultChanged with Completed when selected', () => {
      spyOn(component, 'vehicleChecksToggleResultChanged');
      component.testCategory = TestCategory.BE;
      component.ngOnChanges();
      const vehicleChecksCompletedRadio = fixture.debugElement.query(By.css('#vehicle-checks-toggle-completed'));
      vehicleChecksCompletedRadio.triggerEventHandler('change', { target: { value: 'Completed' } });

      fixture.detectChanges();
      expect(component.vehicleChecksToggleResultChanged).toHaveBeenCalledWith('Completed');
    });
    it('should call VehicleChecksToggleResultChanged with Not completed when not selected', () => {
      spyOn(component, 'vehicleChecksToggleResultChanged');
      component.testCategory = TestCategory.BE;
      component.ngOnChanges();
      const vehicleChecksCompletedRadio = fixture.debugElement.query(By.css('#vehicle-checks-toggle-non-completed'));

      vehicleChecksCompletedRadio.triggerEventHandler('change', { target: { value: 'Not completed' } });
      fixture.detectChanges();
      expect(component.vehicleChecksToggleResultChanged).toHaveBeenCalledWith('Not completed');
    });
  });
});
