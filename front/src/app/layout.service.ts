import { Injectable } from '@angular/core';
import { Constants } from '../classes/Constants';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private newThemeColor = new Subject<String>();
  private loadInitialData = new Subject<Object>();

  themeColor$ = this.newThemeColor.asObservable();
  loadedInitialData$ = this.loadInitialData.asObservable();

  constructor() {
  }

  //for dynamic ui elements, that are re-rendered multiple times, the change is not persistent
  //we have to set their color from their inside, as a property
  //we will, then, create an observer and an emitter down there which will change the color attribute
  //from each dynamic component
  //ex: tab-ribbon, settings-panel, execution-panel, files-panel
  //to be 100% clean code we have to do this type of changing to menu-ribbon as well
  changeThemeColor(theme: String) {
    if (Constants.WHITE_THEMES.includes(theme)) {
      document.body.style.backgroundColor = "whitesmoke";
      (<HTMLElement>document.querySelector(".code-editor")).style.backgroundColor = "whitesmoke";
      document.querySelectorAll(".ui-menuitem").forEach(elem => {
        (<HTMLElement>elem).style.backgroundColor = "white";
      });
      document.querySelectorAll(".ui-menuitem-text").forEach(elem => {
        (<HTMLElement>elem).style.color = "black";
      });
      document.getElementById("menu-panel").style.backgroundColor = "whitesmoke";
      this.changeGeneralThemeColor("white");
    } else {
      document.body.style.backgroundColor = "#101010";
      (<HTMLElement>document.querySelector(".code-editor")).style.backgroundColor = "#101010";
      document.querySelectorAll(".ui-menuitem").forEach(elem => {
        (<HTMLElement>elem).style.backgroundColor = "#101010";
      });
      document.querySelectorAll(".ui-menuitem-text").forEach(elem => {
        (<HTMLElement>elem).style.color = "white";
      });
      document.getElementById("menu-panel").style.backgroundColor = "#101010";
      this.changeGeneralThemeColor("black");
    }
  }

  changeGeneralThemeColor(color: String) {
    this.newThemeColor.next(color);
  }

  initialData() {
    this.loadInitialData.next();
  }

}
