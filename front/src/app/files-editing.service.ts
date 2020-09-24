import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilesEditingService {
  private fileAction = new Subject<Object>();
  private updateFileId = new Subject<Object>();
  private updateStore = new Subject<Object>();
  private savingFile = new Subject<Object>();
  private saveFileShortcut = new Subject<Object>();
  private closeTabIfFileOpenedOnDeletionOrRename = new Subject<Object>();

  actionFired$ = this.fileAction.asObservable();
  updateFileIdFired$ = this.updateFileId.asObservable();
  updateStoreFired$ = this.updateStore.asObservable();
  saveFileSourceFired$ = this.savingFile.asObservable();
  saveFileShortcutFired$ = this.saveFileShortcut.asObservable();
  checkIfFileOpenedOnDeletionOrRename$ = this.closeTabIfFileOpenedOnDeletionOrRename.asObservable();

  fireFileAction(action: Object) {
    this.fileAction.next(action);
  }

  fireUpdateFileId(file: Object) {
    this.updateFileId.next(file);
  }

  fireUpdateStore(tree: Object) {
    this.updateStore.next(tree);
  }

  saveFile(file) {
    this.savingFile.next(file);
  }

  saveFileShortcutCall() {
    this.saveFileShortcut.next();
  }

  checkingFileOnDeletionOrRename(file) {
    this.closeTabIfFileOpenedOnDeletionOrRename.next(file);
  }

  constructor() {}
}
