import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-menu-ribbon',
  templateUrl: './menu-ribbon.component.html',
  styleUrls: ['./menu-ribbon.component.css']
})
export class MenuRibbonComponent implements OnInit {

  items: MenuItem[];
  constructor() { }

  ngOnInit() {

    this.items = [
      {
        label: 'Settings',
        command: (event) => { this.itemClick(event);}
      }, 
      {
        label: 'Contact',
        command: (event) => { this.itemClick(event);}
      },
      {
        label: 'Logout',
        command: (event) => { this.itemClick(event);}
      }
    ]
  }

  itemClick(event){
    let item = event.item;

    console.log("clicked on " + item.label);
  }

}
