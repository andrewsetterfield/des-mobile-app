import { Component, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { TestResultUnion } from "../../types/tests.model";
import { TestsState } from 'src/modules/tests/tests.state';

@Component({
    selector: 'app-tests',
    templateUrl: './tests.page.html',
    styleUrls: ['./tests.page.scss'],
})

export class TestsPage implements OnInit {

  testSlot$: Observable<TestResultUnion>

  constructor(private store: Store) {}

  ngOnInit() {
      this.testSlot$ = this.store.select(TestsState.getCurrentTest);
  }
}
