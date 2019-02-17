import { Component, OnInit } from '@angular/core';
import { NavigationTab } from '../../classes/NavigationTab';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  fileTabs : Array<NavigationTab> = [];
  projectTabs : Array<NavigationTab> = [];

  constructor() {
    this.initFileTabs();
    this.initprojectTabs();
   }

  ngOnInit() {
  }

  initFileTabs(){
    this.fileTabs.push(new NavigationTab("test1", "url1", "code-editor", "content1"));
    this.fileTabs.push(new NavigationTab("test2", "url2", "code-editor", "content2"));
    this.fileTabs.push(new NavigationTab("test3", "url3", "code-editor", "content3"));
    this.fileTabs.push(new NavigationTab("test4", "url3", "code-editor", "content4"));
  }

  initprojectTabs(){
    this.projectTabs.push(new NavigationTab("test1", "url1", "some div", "content1"));
    this.projectTabs.push(new NavigationTab("test2", "url2", "some div", "content2"));
  }

}
