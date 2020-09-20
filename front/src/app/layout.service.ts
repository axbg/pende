import { Injectable } from '@angular/core';
import { Constants } from '../classes/Constants';
import { Subject } from 'rxjs';
import { DoubleData } from 'src/classes/DoubleData';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private loadInitialData = new Subject<Object>();
  private changeSetting = new Subject<DoubleData>();

  settingsChanged$ = this.changeSetting.asObservable();
  loadedInitialData$ = this.loadInitialData.asObservable();

  constructor() {
  }

  changeSettings(setting: DoubleData) {
    switch (setting.getProperty()) {
      case 'theme':
        const color = Constants.WHITE_THEMES.includes(setting.getValue()) ? "white" : "black";        
        setting.setColor(color);
      case 'cursor':
      case 'fontSize':
      case 'gutter':
        this.fireChangeSettings(setting);
        break;
      default:
        break;
    }
  }

  fireChangeSettings(setting: DoubleData) {
    this.changeSetting.next(setting);
  }

  initialData() {
    this.loadInitialData.next();
  }
}
