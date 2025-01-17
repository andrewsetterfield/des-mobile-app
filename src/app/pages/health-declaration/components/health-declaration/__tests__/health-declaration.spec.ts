import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import {
  TranslateModule,
  TranslateService,
  TranslateLoader,
  TranslateParser,
} from '@ngx-translate/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { IonicModule } from '@ionic/angular';
import { HealthDeclarationComponent } from '../health-declaration';

describe('HealthDeclarationComponent', () => {
  let fixture: ComponentFixture<HealthDeclarationComponent>;
  let component: HealthDeclarationComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        HealthDeclarationComponent,
      ],
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        TranslateService,
        TranslateLoader,
        TranslateParser,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(HealthDeclarationComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('ngOnChanges', () => {
      it('should correctly setup the form control', () => {
        // ARRANGE
        component.formGroup = new FormGroup({});
        component.selected = true;
        // ACT
        component.ngOnChanges();
        // ASSERT
        const field = component.formGroup.get(HealthDeclarationComponent.fieldName);
        expect(field.value).toEqual(true);
      });
    });
    describe('healthDeclarationChanged', () => {
      it('should emit a healthDeclarationChange event', () => {
        // ARRANGE
        component.formGroup = new FormGroup({});
        component.ngOnChanges();
        component.healthDeclarationChange = new EventEmitter();
        spyOn(component.healthDeclarationChange, 'emit');

        // ACT
        component.healthDeclarationChanged();
        fixture.detectChanges();

        // ASSERT
        expect(component.healthDeclarationChange.emit).toHaveBeenCalled();
      });
    });
    describe('isInvalid', () => {
      it('should validate the field when it is valid', () => {
        // ARRANGE
        component.formGroup = new FormGroup({});
        component.selected = true;
        component.ngOnChanges();
        fixture.detectChanges();
        // ACT
        const result: boolean = component.isInvalid();

        // ASSERT
        expect(result).toEqual(false);
      });
    });
  });
});
