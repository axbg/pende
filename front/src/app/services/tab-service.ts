import { Injectable } from '@angular/core';
import { NavigationTab } from 'src/app/classes/NavigationTab';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private openNewTabSubject = new Subject<NavigationTab>();
  private renderTabSubject = new Subject<NavigationTab>();
  private renderMenuPanelSubject = new Subject<String>();
  private notifyFileContentChangedSubject = new Subject<Boolean>();
  private notifyFileChangedSubject = new Subject<Object>();
  private notifyLastTabClosedSubject = new Subject<Boolean>();

  openNewTabObservable$ = this.openNewTabSubject.asObservable();
  renderTabSubjectObservable$ = this.renderTabSubject.asObservable();
  renderMenuPanelObservable$ = this.renderMenuPanelSubject.asObservable();
  notifyFileContentChangedObservable$ = this.notifyFileContentChangedSubject.asObservable();
  notifyFileChangedObservable$ = this.notifyFileChangedSubject.asObservable();
  notifyLastTabClosedObservable$ = this.notifyLastTabClosedSubject.asObservable();

  openNewTab(tab: NavigationTab) {
    this.openNewTabSubject.next(tab);
  }

  renderTabSource(tab: NavigationTab) {
    this.renderTabSubject.next(tab);
  }

  renderMenuPanel(panel: String) {
    this.renderMenuPanelSubject.next(panel);
  }

  notifyFileContentChanged(status: Boolean) {
    this.notifyFileContentChangedSubject.next(status);
  }

  notifyFileChanged(file: Object) {
    this.notifyFileChangedSubject.next(file);
  }

  notifyLastTabClosed() {
    this.notifyLastTabClosedSubject.next();
  }
}
