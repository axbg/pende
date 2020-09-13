import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-ribbon',
  templateUrl: './menu-ribbon.component.html',
  styleUrls: ['./menu-ribbon.component.css']
})
export class MenuRibbonComponent implements OnInit {

  private shortVisible = false;
  private contactVisible = false;
  items: MenuItem[];
  constructor(private router: Router) { }

  ngOnInit() {

    this.items = [
      {
        label: 'Shortcuts',
        command: (event) => { this.showDialog('short'); }
      },
      {
        label: 'Contact',
        command: (event) => { this.showDialog('contact'); }
      },
      {
        label: 'Logout',
        command: (event) => { this.logout(); }
      }
    ];
  }

  showDialog(modal) {
    if (modal === 'short') {
      this.shortVisible = true;
    } else {
      this.contactVisible = true;
    }
  }

  logout() {
    window.localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }
}
