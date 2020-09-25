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
  currentIndex: number;

  @Input() tabs: Array<NavigationTab>;
  @Input() target: String;
  @Input() closable: number;

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
        const existingTab = this.tabs.find(fTab => fTab.getId() === tab.getId());

        if (existingTab) {
          this.tabChange(existingTab.getIndex());
        } else {
          tab.setIndex(this.tabs.length);
          this.tabs.push(tab);
          this.tabChange(tab.getIndex());
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

  closeTabProcedure(index: any) {
    if (this.tabs.length > 1) {
      if (this.currentIndex === index && index !== 0) {
        this.currentIndex--;
      } else if (this.currentIndex > index) {
        this.currentIndex--;
        for (let i = index + 1; i < this.tabs.length; i++) {
          this.tabs[i].setIndex(i - 1);
        }
      }
      this.tabs.splice(index, 1);
      this.renderTab();
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
