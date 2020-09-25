import { Component, OnInit } from '@angular/core';
import { NavigationTab } from 'src/app/classes/NavigationTab';
import { NgxSpinnerService } from 'ngx-spinner';
import { LayoutService } from 'src/app/services/layout.service';
import { WebSocketsService } from 'src/app/services/web-sockets.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  fileTabs: Array<NavigationTab> = [];
  projectTabs: Array<NavigationTab> = [];
  menuItems: [];
  themeColor: String;

  constructor(private spinner: NgxSpinnerService, private layoutService: LayoutService,
    webSocketService: WebSocketsService) {
    this.initProjectTabs();
    this.layoutService.loadInitialDataObservable$.subscribe(() => {
      this.spinner.hide();
    });

    this.layoutService.changeSettingObservable$.subscribe((settings) => {
      if (settings.getProperty() === 'theme') {
        this.themeColor = settings.getColor();
      }
    });
  }

  ngOnInit() {
    this.spinner.show();
  }

  initProjectTabs() {
    this.projectTabs.push(new NavigationTab(0, 'Files', '', '', 0));
    this.projectTabs.push(new NavigationTab(0, 'Execute', '', '', 1));
    this.projectTabs.push(new NavigationTab(0, 'Settings', '', '', 2));
  }
}
