/* eslint-disable */

// import { SignaturePad } from 'angular2-signaturepad';
// import { TestBed, async, ComponentFixture } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { Store } from '@ngrx/store';
// import { MockComponent } from 'ng-mocks';
// import { IonicModule } from '@ionic/angular';
// import { configureTestSuite } from 'ng-bullet';
// import { SignatureAreaComponent } from '../signature-area';

class TestStore {
}
// @TODO - MES-6627 - reintroduce spec when component is working
// describe('SignatureAreaComponent', () => {
//   let fixture: ComponentFixture<SignatureAreaComponent>;
//   let component: SignatureAreaComponent;
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         SignatureAreaComponent,
//         MockComponent(SignaturePad),
//       ],
//       imports: [
//         IonicModule,
//       ],
//       providers: [
//         { provide: Store, useClass: TestStore },
//       ],
//     });
//   });
//
//   beforeEach(async(() => {
//     fixture = TestBed.createComponent(SignatureAreaComponent);
//     component = fixture.componentInstance;
//     component.initialiseSignaturePad();
//   }));
//   describe('Class', () => {
//     describe('signature', () => {
//       fit('setSignature should update the signature property and call signatureDataChangedDispatch', () => {
//         spyOn(component, 'signatureDataChangedDispatch');
//         component.signature = undefined;
//         console.log(component.signaturePad);
//         component.setSignature('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyEAAAD');
//         expect(component.signature).toEqual('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyEAAAD');
//         expect(component.signatureDataChangedDispatch).toHaveBeenCalled();
//       });
//       it('clear should clear the signature property and call signatureDataClearedDispatch', () => {
//         spyOn(component, 'signatureDataClearedDispatch');
//         component.signature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyEAAAD';
//         component.clear();
//         expect(component.signature).toBeNull();
//         expect(component.signatureDataClearedDispatch).toHaveBeenCalled();
//       });
//       it('drawComplete should call signatureDataChangedDispatch', () => {
//         spyOn(component, 'signatureDataChangedDispatch');
//         component.drawComplete();
//         expect(component.signatureDataChangedDispatch).toHaveBeenCalled();
//       });
//     });
//   });
//
//   describe('DOM', () => {
//     describe('signHereText ', () => {
//       it('sign line text should equal the signHereText property', () => {
//         component.signHereText = 'sign here for millions';
//         fixture.detectChanges();
//         const signHereElement: HTMLElement = fixture.debugElement.query(By.css('.sign-here-label')).nativeElement;
//         expect(signHereElement.textContent).toEqual('sign here for millions');
//       });
//       it('sign line text should default when the signHereText property is falsy', () => {
//         component.signHereText = undefined;
//         fixture.detectChanges();
//         const signHereElement: HTMLElement = fixture.debugElement.query(By.css('.sign-here-label')).nativeElement;
//         expect(signHereElement.textContent).toEqual('Sign here');
//       });
//     });
//
//     describe('retryButtonText ', () => {
//       it('retry button text should equal the retryButtonText property', () => {
//         component.retryButtonText = 'try again';
//         fixture.detectChanges();
//         const retryButtonElement: HTMLElement = fixture.debugElement.query(By.css('#retry-button-label')).nativeElement;
//         expect(retryButtonElement.textContent).toEqual('try again');
//       });
//       it('retry button text should default when the retryButtonText property is falsy', () => {
//         component.retryButtonText = undefined;
//         fixture.detectChanges();
//         const retryButtonElement: HTMLElement = fixture.debugElement.query(By.css('#retry-button-label')).nativeElement;
//         expect(retryButtonElement.textContent).toEqual('Retry');
//       });
//     });
//
//     describe('image source', () => {
//       it('retryImage, when set, should change the retry image source attribute', () => {
//         component.retryImage = '/some/path';
//         fixture.detectChanges();
//         const retryImageElement: HTMLElement = fixture.debugElement.query(
//           By.css('#retry-icon')).nativeElement;
//         expect(retryImageElement.getAttribute('style')).toEqual('background-image: url("/some/path");');
//       });
//       it('retryImage, when not set, should defualt the retry image source attrubute', () => {
//         fixture.detectChanges();
//         const retryImageElement: HTMLElement = fixture.debugElement.query(
//           By.css('#retry-icon')).nativeElement;
//         expect(retryImageElement.getAttribute('style'))
//           .toEqual('background-image: url("/assets/imgs/waiting-room/retry.png");');
//       });
//     });
//   });
// });

/* eslint-enable */