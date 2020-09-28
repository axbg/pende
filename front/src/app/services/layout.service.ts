import { Injectable } from '@angular/core';
import { Constants } from 'src/app/classes/Constants';
import { Subject } from 'rxjs';
import { SettingData } from 'src/app/classes/SettingData';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private loadInitialDataSubject = new Subject<Object>();
  private changeSettingSubject = new Subject<SettingData>();

  changeSettingObservable$ = this.changeSettingSubject.asObservable();
  loadInitialDataObservable$ = this.loadInitialDataSubject.asObservable();

  constructor() {
  }

  changeSettings(setting: SettingData) {
    switch (setting.getProperty()) {
      case 'theme':
        const color = Constants.WHITE_THEMES.includes(setting.getValue()) ? 'white' : 'black';
        setting.setColor(color);
      // tslint:disable-next-line: no-switch-case-fall-through
      case 'cursor':
      case 'fontSize':
      case 'gutter':
        this.changeSetting(setting);
        break;
      default:
        break;
    }
  }

  changeSetting(setting: SettingData) {
    this.changeSettingSubject.next(setting);
  }

  loadInitialData() {
    this.loadInitialDataSubject.next();
  }
}
