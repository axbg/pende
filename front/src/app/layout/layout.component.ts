import { Component, OnInit } from '@angular/core';
import { NavigationTab } from '../../classes/NavigationTab';
import { NgxSpinnerService } from 'ngx-spinner';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  fileTabs: Array<NavigationTab> = [];
  projectTabs: Array<NavigationTab> = [];
  menuItems: [];

  constructor(private spinner: NgxSpinnerService, private layourService: LayoutService) {
    this.initFileTabs();
    this.initprojectTabs();
    this.layourService.loadedInitialData$.subscribe(() => {
      this.spinner.hide();
    })
  }

  ngOnInit() {
    this.spinner.show();
  }

  initFileTabs() {
    this.fileTabs.push(new NavigationTab(0, "webide", "Hack with passion!", "", 0));
  }

  initprojectTabs() {
    this.projectTabs.push(new NavigationTab(0, "Files", "", "", 0));
    this.projectTabs.push(new NavigationTab(0, "Execute", "", "", 1));
    this.projectTabs.push(new NavigationTab(0, "Settings", "", "", 2));
  }

}
