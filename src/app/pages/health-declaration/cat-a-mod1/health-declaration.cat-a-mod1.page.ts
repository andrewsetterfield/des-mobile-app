import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';

@Component({
  selector: 'app-health-declaration-cat-a-mod1',
  templateUrl: './health-declaration.cat-a-mod1.page.html',
  styleUrls: ['./health-declaration.cat-a-mod1.page.scss'],
})
export class HealthDeclarationCatAMod1Page implements OnInit {

  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
  ) { }

  ngOnInit() {
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.CONFIRM_TEST_DETAILS_PAGE);
  }

}