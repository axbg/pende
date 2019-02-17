import { Component, OnInit, Input } from '@angular/core';
import { NavigationTab } from '../../classes/NavigationTab';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { TargetLocator } from 'selenium-webdriver';


@Component({
  selector: 'app-tab-ribbon',
  templateUrl: './tab-ribbon.component.html',
  styleUrls: ['./tab-ribbon.component.css']
})
export class TabRibbonComponent implements OnInit {

  @Input() tabs: Array<NavigationTab>;
  @Input() target: String;
  @Input() closable: number;
  currentIndex: number;

  constructor() {
  }

  ngOnInit() {
    this.currentIndex = 0;
    this.renderTab();
  }

  renderTab() {
    let selectedTab = this.tabs[this.currentIndex];
    let targetElement = document.getElementById(this.target.toString());
    targetElement.textContent = selectedTab.getContent().toString();
  }

  clearTarget() {
    let targetElement = document.getElementById(this.target.toString());
    targetElement.textContent = "Open something";
  }

  tabChange(index) {
    this.currentIndex = index;
    this.renderTab();
  }

  closeTab(index) {

    if (this.tabs.length > 1) {

      if (this.currentIndex === index && index !== 0) {
        this.tabs.splice(index, 1);
        this.tabChange(this.currentIndex - 1);
      } else if (this.currentIndex > index) {
        //little bug here
        //example
        //when tab 4 is selected and tab 2 is deleted
        //selection will jump to tab 3, instead of tab 4
        this.tabs.splice(index, 1);
        this.currentIndex = this.currentIndex - 1;

      } else if (index === 0) {
        this.tabs.splice(index, 1);
        this.renderTab();
      } else if (index === 0 && index === this.currentIndex) {
        this.tabs.splice(index, 1);
        this.renderTab();
      } else {
        this.tabs.splice(index, 1);
      }
    } else {
      this.tabs.splice(index, 1);
      this.clearTarget();
    }

  }

}
