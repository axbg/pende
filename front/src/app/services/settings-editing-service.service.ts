import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DoubleData } from 'src/app/classes/DoubleData';

@Injectable({
  providedIn: 'root'
})
export class SettingsEditingServiceService {
  private currentSettings = new Subject<DoubleData>();
  private saveSettings = new Subject();

  public modifiedSettings$ = this.currentSettings.asObservable();
  public savingSettings$ = this.saveSettings.asObservable();

  constructor() { }

  modifySettings(settings: DoubleData) {
    this.currentSettings.next(settings);
  }

  saveCurrentSettings() {
    this.saveSettings.next();
  }
}
