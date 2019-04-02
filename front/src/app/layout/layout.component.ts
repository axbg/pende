import { Component, OnInit } from '@angular/core';
import { NavigationTab } from '../../classes/NavigationTab';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  fileTabs: Array<NavigationTab> = [];
  projectTabs: Array<NavigationTab> = [];
  menuItems: [];

  constructor(private spinner: NgxSpinnerService) {
    this.initFileTabs();
    this.initprojectTabs();
  }

  ngOnInit() {
    /*
    //api calls to load all data
    //call services to inject data in the components that need it
    //when data is loaded, loaded becomes true and layout is displayed
    this.spinner.show();

    setTimeout(() => {
      //the spinner will be disabled when data is loaded
      //this is just an example of displaying
      this.spinner.hide();
    }, 2000);
    */
  }

  initFileTabs() {
    this.fileTabs.push(new NavigationTab(0, "Hack with passion!", "Welcome to webide", "", 0));
  }

  initprojectTabs() {
    this.projectTabs.push(new NavigationTab(0, "Files", "", "", 0));
    this.projectTabs.push(new NavigationTab(0, "Execute", "", "", 1));
    this.projectTabs.push(new NavigationTab(0, "Settings", "", "", 2));
  }

}
