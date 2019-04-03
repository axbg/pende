import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { NavigationTab } from 'src/classes/NavigationTab';

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {

  private checkFileStatus = new Subject();
  private modifiedFile = new Subject<NavigationTab>();
  private unmodifiedFile = new Subject<NavigationTab>();
  private showBreakpoints = new Subject();
  private setExecutionBreakpoints = new Subject<number[]>();

  beforeExecutionFileStatusCheck$ = this.checkFileStatus.asObservable();
  getModifiedFile$ = this.modifiedFile.asObservable();
  getUnmodifiedFile$ = this.unmodifiedFile.asObservable();
  detectExecutionBreakpoints$ = this.showBreakpoints.asObservable();
  getExecutionBreakpoints$ = this.setExecutionBreakpoints.asObservable();

  constructor() { }

  checkCurrentFileStatus(){
    this.checkFileStatus.next();
  }

  sendModifiedFile(tab: NavigationTab){
    this.modifiedFile.next(tab);
  }

  sendUnmodifiedFile(tab: NavigationTab){
    this.unmodifiedFile.next(tab);
  }

  showExecutionBreakpoints(){
    this.showBreakpoints.next();
  }

  sendExecutionBreakpoints(breakpoints: number[]){
    this.setExecutionBreakpoints.next(breakpoints);
  }


}
