import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {

  private checkFileStatus = new Subject();
  private currentFileId = new Subject<any>();
  private showBreakpoints = new Subject();
  private setExecutionBreakpoints = new Subject<number[]>();

  beforeExecutionFileStatusCheck$ = this.checkFileStatus.asObservable();
  getExecutedFileId$ = this.currentFileId.asObservable();
  detectExecutionBreakpoints$ = this.showBreakpoints.asObservable();
  getExecutionBreakpoints$ = this.setExecutionBreakpoints.asObservable();

  constructor() { }

  checkCurrentFileStatus(){
    this.checkFileStatus.next();
  }

  sendCurrentFileId(id: number, name: String){
    this.currentFileId.next([id, name]);
  }

  showExecutionBreakpoints(){
    this.showBreakpoints.next();
  }

  sendExecutionBreakpoints(breakpoints: number[]){
    this.setExecutionBreakpoints.next(breakpoints);
  }


}
