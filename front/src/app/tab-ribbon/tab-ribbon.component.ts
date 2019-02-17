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
  currentIndex: number = 0;

  constructor() {
  }

  ngOnInit() {
  }

  renderTab() {
    let selectedTab = this.tabs[this.currentIndex];
    let target = document.getElementById(selectedTab.getRenderBody().toString());
    target.textContent = selectedTab.getContent().toString();
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
    if (index > 0) {
      this.tabs.splice(index, 1);
    } else if (index == 0 && this.tabs.length > 1) {
      this.tabs.splice(index, 1);
    } else {
      this.tabs.splice(index, 1);
      this.clearTarget();
    }
  }

}
