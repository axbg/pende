import { Injectable } from '@angular/core';
import { NavigationTab } from '../classes/NavigationTab';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabEditingServiceService {

  private currentFileSource = new Subject<NavigationTab>();
  private modifiedFileSurce = new Subject<NavigationTab>();

  tabOpened$ = this.currentFileSource.asObservable();
  tabClosed$ = this.modifiedFileSurce.asObservable();

  renderTabSource(tab : NavigationTab){
    this.currentFileSource.next(tab);
  }

  saveTabSource(tab : NavigationTab){
    this.modifiedFileSurce.next(tab);
  }

}
