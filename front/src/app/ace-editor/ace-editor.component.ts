import { Component, ViewChild, OnInit } from '@angular/core';
import { TabEditingServiceService } from '../tab-editing-service.service';
import { NavigationTab } from '../../classes/NavigationTab';
import { SettingsEditingServiceService } from '../settings-editing-service.service';

@Component({
  selector: 'app-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.css'],
})
export class AceEditorComponent implements OnInit {
  @ViewChild('editor') editor;
  currentTab: NavigationTab;

  constructor(private tabEditingService: TabEditingServiceService,
    private settingsEditingService: SettingsEditingServiceService) {

    this.tabEditingService.tabOpened$.subscribe(
      tab => {

        if (this.currentTab) {
          this.currentTab.setContent(this.editor.getEditor().getValue());
          this.currentTab.setCursor(this.editor.getEditor().selection.getCursor().row, this.editor.getEditor().selection.getCursor().column);
          this.tabEditingService.saveTabSource(this.currentTab);
        }

        this.currentTab = tab;
        this.editor.getEditor().setValue(this.currentTab.getContent());
        this.editor.getEditor().selection.moveTo(this.currentTab.getCursorLine(), this.currentTab.getCursorColumn());
        this.editor.getEditor().focus();
      }
    )

    this.settingsEditingService.modifiedSettings$.subscribe(
      setting => {
        switch (setting.getProperty()) {
          case "theme":
            this.editor.setTheme(setting.getValue());
            break;
          case "cursor":
            this.editor.getEditor().setOptions({
              keyboardHandler: setting.getValue()
            })
            break;
          case "fontSize":
            this.editor.getEditor().setOptions({
              fontSize: setting.getValue() + "px"
            })
            break;
          case "gutter":
            this.editor.getEditor().setOptions({
              showGutter: setting.getValue()
            })
            break;
          default:
        }
      })
  }

  ngOnInit() {
    this.generateBreakPoints();
  }

  generateBreakPoints() {
    const gutt = document.querySelector(".ace_layer");

    function addOrRemoveBreakpoint(e) {

      let line = e.target.innerText;

      if (e.target.classList.contains("breakpoint")) {
        //service to remove breakpoint
        e.target.classList.remove("breakpoint");
      } else {
        //service to add breakpoint
        e.target.classList.add("breakpoint");
      }
    }

    gutt.addEventListener("DOMNodeInserted", function (e) {
      e.target.removeEventListener("click", addOrRemoveBreakpoint);
      e.target.addEventListener("click", addOrRemoveBreakpoint);
    });
  }

  ngAfterViewInit() {
    this.editor.setTheme("dracula");
    this.editor.setMode("c_cpp");

    this.editor.getEditor().setOptions({
      enableLiveAutocompletion: true,
      copyWithEmptySelection: true
    });

    this.editor.getEditor().commands.addCommand({
      name: "showOtherCompletions",
      bindKey: "Ctrl-.",
      exec: function (editor) {
        console.log(editor.getValue());
      }
    })
  }


}