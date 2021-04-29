import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { FormGroup } from '@angular/forms';
import { CBTNumberComponent } from '../cbt-number';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../../../app.module';
import { IonicModule } from '@ionic/angular';

describe('CBTNumberComponent', () => {
  let fixture: ComponentFixture<CBTNumberComponent>;
  let component: CBTNumberComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CBTNumberComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CBTNumberComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  }));

  describe('Class', () => {
    describe('cbtNumberChanged', () => {
      it('It should emit a cbt number if the characters only contain numbers', () => {
        spyOn(component.cbtNumberChange, 'emit');
        const cbtNumber = '1234567';
        component.cbtNumberChanged(cbtNumber);
        expect(component.cbtNumberChange.emit).toHaveBeenCalledWith(cbtNumber);
      });
    });

    describe('invalid', () => {
      it('should be invalid the length is greater then 7', () => {
        component.cbtNumber = '12345678';
        component.ngOnChanges();
        const result: boolean = component.invalid();
        expect(result).toEqual(false);
      });
      it('should be invalid when the length is less then 7', () => {
        component.cbtNumber = '1234';
        component.ngOnChanges();
        const result: boolean = component.invalid();
        expect(result).toEqual(false);
      });
      it('should be invalid when the field when it is empty', () => {
        component.cbtNumber = '';
        component.ngOnChanges();
        const result: boolean = component.invalid();
        expect(result).toEqual(false);
      });
    });
  });
});
