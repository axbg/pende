import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesEditingService {

  private fileAction = new Subject<Object>();
  private updateFileId = new Subject<Object>();

  actionFired$ = this.fileAction.asObservable();
  updateFileIdFired$ = this.updateFileId.asObservable();

  fireFileAction(action: Object) {
    this.fileAction.next(action);
  }

  fireUpdateFileId(file: Object) {
    this.updateFileId.next(file);
  }

  constructor() { }
}
