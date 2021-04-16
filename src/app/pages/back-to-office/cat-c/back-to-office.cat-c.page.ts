import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-back-to-office-cat-c',
  templateUrl: './back-to-office.cat-c.page.html',
  styleUrls: ['./back-to-office.cat-c.page.scss'],
})
export class BackToOfficeCatCPage implements OnInit {

  constructor(
    public navController: NavController,
    public routeByCat: RouteByCategoryProvider,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.OFFICE_PAGE, TestCategory.C);
  }

}
