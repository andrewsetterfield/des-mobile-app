import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';

@Component({
  selector: 'app-communication.cat-b',
  templateUrl: './communication.cat-b.page.html',
  styleUrls: ['./communication.cat-b.page.scss'],
})
export class CommunicationCatBPage implements OnInit {

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
    await this.routeByCat.navigateToPage('WAITING_ROOM_TO_CAR_PAGE', TestCategory.B);
  }

}