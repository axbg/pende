import { Component, Input } from '@angular/core';
import { TabService } from 'src/app/services/tab-service';
import { LayoutService } from 'src/app/services/layout.service';
import { WsEvent } from 'src/app/classes/WsEvent';

@Component({
  selector: 'app-panel-holder',
  templateUrl: './panel-holder.component.html',
  styleUrls: ['./panel-holder.component.css'],
})
export class PanelHolderComponent {
  @Input() panel: String;

  themeColor: String = 'white';

  constructor(
    private tabEditingService: TabService,
    private layoutService: LayoutService
  ) {
    this.tabEditingService.menuPanel$.subscribe((payload) => {
      this.panel = payload;
    });

    this.layoutService.changeSettingObservable$.subscribe((payload) => {
      if (payload.getProperty() === 'theme') {
        this.themeColor = payload.getColor();
      }
    });
  }
}
