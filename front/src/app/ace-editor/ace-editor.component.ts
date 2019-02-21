import { Component, ViewChild, OnInit } from '@angular/core';
import { TabEditingServiceService } from '../tab-editing-service.service';
import { NavigationTab } from '../../classes/NavigationTab';
import { of } from 'rxjs';

@Component({
  selector: 'app-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.css'],
})
export class AceEditorComponent implements OnInit {
  @ViewChild('editor') editor;
  currentTab: NavigationTab;

  constructor(private tabEditingService: TabEditingServiceService) {
    this.tabEditingService.tabOpened$.subscribe(
      tab => {

        if (this.currentTab) {
          this.currentTab.setContent(this.editor.getEditor().getValue());
          this.tabEditingService.saveTabSource(this.currentTab);
          //sends the new cursor position
        }

        this.currentTab = tab;
        this.editor.getEditor().setValue(this.currentTab.getContent());
        //get the cursor from object and position it
      }
    )
  }

  ngOnInit() {

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