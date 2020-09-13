import { Injectable } from '@angular/core';
import { Constants } from '../classes/Constants';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private newThemeColor = new Subject<String>();
  private loadInitialData = new Subject<Object>();

  themeColor$ = this.newThemeColor.asObservable();
  loadedInitialData$ = this.loadInitialData.asObservable();

  constructor() {
  }

  changeThemeColor(theme: String) {
    if (Constants.WHITE_THEMES.includes(theme)) {
      document.body.style.backgroundColor = 'whitesmoke';
      (<HTMLElement>document.querySelector('.code-editor')).style.backgroundColor = 'whitesmoke';
      document.querySelectorAll('.ui-menuitem').forEach(elem => {
        (<HTMLElement>elem).style.backgroundColor = 'white';
      });
      document.querySelectorAll('.ui-menuitem-text').forEach(elem => {
        (<HTMLElement>elem).style.color = 'black';
      });
      document.getElementById('menu-panel').style.backgroundColor = 'whitesmoke';
      this.changeGeneralThemeColor('white');
    } else {
      document.body.style.backgroundColor = '#101010';
      (<HTMLElement>document.querySelector('.code-editor')).style.backgroundColor = '#101010';
      document.querySelectorAll('.ui-menuitem').forEach(elem => {
        (<HTMLElement>elem).style.backgroundColor = '#101010';
      });
      document.querySelectorAll('.ui-menuitem-text').forEach(elem => {
        (<HTMLElement>elem).style.color = 'white';
      });
      document.getElementById('menu-panel').style.backgroundColor = '#101010';
      this.changeGeneralThemeColor('black');
    }
  }

  changeGeneralThemeColor(color: String) {
    this.newThemeColor.next(color);
  }

  initialData() {
    this.loadInitialData.next();
  }

}
