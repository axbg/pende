import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {

  private checkFileStatus = new Subject();
  private currentFileId = new Subject<any>();

  beforeExecutionFileStatusCheck$ = this.checkFileStatus.asObservable();
  getExecutedFileId$ = this.currentFileId.asObservable();

  checkCurrentFileStatus(){
    this.checkFileStatus.next();
  }

  sendCurrentFileId(id: number, name: String){
    this.currentFileId.next([id, name]);
  }

  constructor() { }
}
