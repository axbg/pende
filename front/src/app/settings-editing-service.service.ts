import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { DoubleData } from 'src/classes/DoubleData';

@Injectable({
  providedIn: 'root'
})
export class SettingsEditingServiceService {

  private currentSettings = new Subject<DoubleData>();
  public modifiedSettings$ = this.currentSettings.asObservable();

  constructor() { }

  modifySettings(settings: DoubleData) {
    this.currentSettings.next(settings);
  }
}
