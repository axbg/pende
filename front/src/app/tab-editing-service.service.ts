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
  private fileSourceModified = new Subject<Object>();

  newTab$ = this.newFileSource.asObservable();
  tabOpened$ = this.currentFileSource.asObservable();
  tabClosed$ = this.modifiedFileSource.asObservable();
  menuPanel$ = this.modifiedMenuPanel.asObservable();
  getFileSource$ = this.fileSourceModified.asObservable();

  openNewTab(tab: NavigationTab) {
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

  notifyFileStore(file: Object) {
    this.fileSourceModified.next(file);
  }

}
