import { Injectable } from '@angular/core';
import { NavigationTab } from '../classes/NavigationTab';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabEditingServiceService {

  private currentFileSource = new Subject<NavigationTab>();
  private modifiedFileSource = new Subject<NavigationTab>();

  tabOpened$ = this.currentFileSource.asObservable();
  tabClosed$ = this.modifiedFileSource.asObservable();

  renderTabSource(tab : NavigationTab){
    this.currentFileSource.next(tab);
  }

  saveTabSource(tab : NavigationTab){
    this.modifiedFileSource.next(tab);
  }

}
