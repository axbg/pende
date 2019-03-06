import { Injectable } from '@angular/core';
import { NavigationTab } from '../classes/NavigationTab';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabEditingServiceService {

  private newFileSource = new Subject<NavigationTab>();
  private currentFileSource = new Subject<NavigationTab>();
  private modifiedFileSource = new Subject<NavigationTab>();
  private modifiedMenuPanel = new Subject<String>();

  newTab$ = this.newFileSource.asObservable();
  tabOpened$ = this.currentFileSource.asObservable();
  tabClosed$ = this.modifiedFileSource.asObservable();
  menuPanel$ = this.modifiedMenuPanel.asObservable();

  openNewTab(URL: string) {
    //here a rest call should be performed to get the content
    //also should include the back-end id in navigation tab
    let tab = new NavigationTab("dynamic_file", URL, 'this tha content', 0);
    this.newFileSource.next(tab);
  }

  renderTabSource(tab: NavigationTab) {
    this.currentFileSource.next(tab);
  }

  saveTabSource(tab: NavigationTab) {
    this.modifiedFileSource.next(tab);
  }

  renderMenuPanel(panel: String) {
    this.modifiedMenuPanel.next(panel);
  }

}
