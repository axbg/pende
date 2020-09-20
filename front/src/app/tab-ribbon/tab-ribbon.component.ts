import { Component, OnInit, Input } from '@angular/core';
import { NavigationTab } from '../../classes/NavigationTab';
import { TabEditingServiceService } from '../tab-editing-service.service';
import { FilesEditingService } from '../files-editing.service';

@Component({
  selector: 'app-tab-ribbon',
  templateUrl: './tab-ribbon.component.html',
  styleUrls: ['./tab-ribbon.component.css'],
})
export class TabRibbonComponent implements OnInit {

  @Input() tabs: Array<NavigationTab>;
  @Input() target: String;
  @Input() closable: number;
  currentIndex: number;

  constructor(private tabEditingService: TabEditingServiceService, private fileEditingService: FilesEditingService) {
    this.fileEditingService.checkIfFileOpenedOnDeletionOrRename$.subscribe(file => {
      if (this.closable) {
        for (let index = 0; index < this.tabs.length; index++) {
          if (this.tabs[index].getPath() === file['path'] && this.tabs[index].getTitle() === file['name']) {
            this.closeTabProcedure(index);
            break;
          }
        }
      }
    });
  }

  ngOnInit() {
    this.currentIndex = 0;
    this.renderTab();

    if (this.closable) {
      this.tabEditingService.newTab$.subscribe(tab => {
        if (!this.tabs.some(existingTab => {
          if (existingTab.getId() === tab.getId()) {
            this.currentIndex = existingTab.getIndex();
            return true;
          }
        })) {
          tab.setIndex(this.tabs.length);
          this.tabs.push(tab);
          this.tabChange(tab.getIndex());
        } else {
          this.renderTab();
        }
      });
    }
  }

  renderTab() {
    if (this.closable) {
      this.tabEditingService.renderTabSource(this.tabs[this.currentIndex]);
    } else {
      this.tabEditingService.renderMenuPanel(this.tabs[this.currentIndex].getTitle());
    }
  }

  clearTarget() {
    this.tabEditingService.renderTabSource(new NavigationTab('', '', '', '', 0));
  }

  tabChange(index) {
    this.currentIndex = index;
    this.renderTab();
  }

  closeTabProcedure(index) {
    if (this.tabs.length > 1) {
      if (this.currentIndex === index && index !== 0) {
        this.tabs.splice(index, 1);
        this.tabChange(this.currentIndex - 1);
      } else if (this.currentIndex > index) {
        // little bug here
        // example
        // when tab 4 is selected and tab 2 is deleted
        // selection will jump to tab 3, instead of tab 4
        this.tabs.splice(index, 1);
        this.currentIndex = this.currentIndex - 1;

      } else if (index === 0) {
        this.tabs.splice(index, 1);
        this.renderTab();
      } else if (index === 0 && index === this.currentIndex) {
        this.tabs.splice(index, 1);
        this.renderTab();
      } else {
        this.tabs.splice(index, 1);
      }
    } else {
      this.tabs.splice(index, 1);
      this.clearTarget();
      this.tabEditingService.notifyLastTabClosed();
    }
  }

  closeTab(index) {
    if (this.tabs[index].getModified()) {
      if (confirm('Do you want to close this file?')) {
        if (confirm('Do you want to save the file before leaving?')) {
          this.fileEditingService.saveFileShortcutCall();
        }
        this.closeTabProcedure(index);
      }
    } else {
      this.closeTabProcedure(index);
    }
  }

}
