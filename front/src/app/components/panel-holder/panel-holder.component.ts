import { Component, Input } from '@angular/core';
import { TabService } from 'src/app/services/tab-service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-panel-holder',
  templateUrl: './panel-holder.component.html',
  styleUrls: ['./panel-holder.component.css'],
})
export class PanelHolderComponent {
  themeColor: String = 'white';

  @Input()
  panel: String = "";

  constructor(private tabService: TabService, private layoutService: LayoutService) {
    this.tabService.renderMenuPanelObservable$.subscribe((payload) => {
      this.panel = payload;
    });

    this.layoutService.changeSettingObservable$.subscribe((payload) => {
      if (payload.getProperty() === 'theme') {
        this.themeColor = payload.getColor()!;
      }
    });
  }
}
