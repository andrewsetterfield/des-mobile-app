import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';
import { PrivacyNoticeComponent } from '../privacy-notice';

describe('PrivacyNoticeComponent', () => {
  let fixture: ComponentFixture<PrivacyNoticeComponent>;
  let component: PrivacyNoticeComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PrivacyNoticeComponent,
      ],
      imports: [
        IonicModule,
        TranslateModule,
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PrivacyNoticeComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should compile', () => {
      expect(component).toBeDefined();
    });
  });

});
