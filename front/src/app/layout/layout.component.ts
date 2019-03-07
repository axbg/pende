import { Component, OnInit } from '@angular/core';
import { NavigationTab } from '../../classes/NavigationTab';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  fileTabs: Array<NavigationTab> = [];
  projectTabs: Array<NavigationTab> = [];
  menuItems: [];

  constructor() {
    this.initFileTabs();
    this.initprojectTabs();
  }

  ngOnInit() {
  }

  initFileTabs() {
    this.fileTabs.push(new NavigationTab(0, "Hack with passion!", "Welcome to webide", 0));
  }

  initprojectTabs() {
    this.projectTabs.push(new NavigationTab(0, "Files", "", 0));
    this.projectTabs.push(new NavigationTab(0, "Execute", "", 1));
    this.projectTabs.push(new NavigationTab(0, "Settings", "", 2));
  }

}
