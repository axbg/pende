import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private loadSettingsSubject = new Subject<any>();
  private saveSettingsSubject = new Subject<any>();

  public loadSettingsObservable$ = this.loadSettingsSubject.asObservable();
  public saveSettingsObservable$ = this.saveSettingsSubject.asObservable();

  constructor() { }

  loadSettings(settings: any) {
    this.loadSettingsSubject.next(settings);
  }

  saveSettings(settings: any) {
    this.saveSettingsSubject.next(settings);
  }
}
