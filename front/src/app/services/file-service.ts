import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private loadFilesSubject = new Subject<Object>();
  private fileActionSubject = new Subject<Object>();
  private saveFileSubject = new Subject<Object>();
  private saveFileShortcutSubject = new Subject<Object>();
  private closeTabOnFileChangeSubject = new Subject<Object>();

  loadFilesObservable$ = this.loadFilesSubject.asObservable();
  fileActionObservable$ = this.fileActionSubject.asObservable();
  saveFileObservable$ = this.saveFileSubject.asObservable();
  saveFileShortcutObservable$ = this.saveFileShortcutSubject.asObservable();
  closeTabOnFileChangeObservable$ = this.closeTabOnFileChangeSubject.asObservable();

  loadFiles(files: any[]) {
    this.loadFilesSubject.next(files);
  }

  fileAction(action: Object) {
    this.fileActionSubject.next(action);
  }

  saveFile(file: any) {
    this.saveFileSubject.next(file);
  }

  saveFileShortcut() {
    this.saveFileShortcutSubject.next();
  }

  closeTabOnFileChange(file: any) {
    this.closeTabOnFileChangeSubject.next(file);
  }

  constructor() {}
}
