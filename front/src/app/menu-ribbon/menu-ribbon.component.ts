import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-ribbon',
  templateUrl: './menu-ribbon.component.html',
  styleUrls: ['./menu-ribbon.component.css']
})
export class MenuRibbonComponent implements OnInit {

  private shortVisible: boolean = false;
  private contactVisible: boolean = false;
  items: MenuItem[];
  constructor() { }

  ngOnInit() {

    this.items = [
      {
        label: 'Shortcuts',
        command: (event) => { this.showDialog("short"); }
      },
      {
        label: 'Contact',
        command: (event) => { this.showDialog("contact"); }
      },
      {
        label: 'Logout',
        command: (event) => { this.logout(); }
      }
    ]
  }

  showDialog(modal) {
    if (modal === "short") {
      this.shortVisible = true;
    } else {
      this.contactVisible = true;
    }
  }

  logout() {
    console.log('implement logout');
  }
}