import { Component, OnInit, Input, OnChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TreeModel, TreeComponent } from 'ng2-tree';
import { TabEditingServiceService } from '../tab-editing-service.service';
import { FilesEditingService } from '../files-editing.service';

@Component({
  selector: 'app-files-panel',
  templateUrl: './files-panel.component.html',
  styleUrls: ['./files-panel.component.css']
})

export class FilesPanelComponent implements OnInit {

  private tree: TreeModel = {
    value: 'projects',
    id: 0,
    settings: {
      'static': false,
      'rightMenu': true,
      'leftMenu': false,
      'cssClasses': {
        'expanded': 'pi pi-angle-down margin clickable',
        'collapsed': 'pi pi-angle-right margin clickable',
        'leaf': 'nothing',
        'empty': 'pi pi-circle-off margin clickable'
      },
      'templates': {
        'node': '<i class="pi pi-folder clickable"></i>',
        'leaf': '<i class="pi pi-file clickable"></i>',
        'leftMenu': '<i></i>',
      }
    }
  }

  @Input()
  files: any;

  @ViewChild("treeComponent")
  treeComponent

  constructor(private tabEditingService: TabEditingServiceService,
    private filesEditingService: FilesEditingService) {

    this.filesEditingService.updateFileIdFired$.subscribe(file => {
      let controller = this.treeComponent.getControllerByNodeId(file['oldId']);
      controller.changeNodeId(file['newId']);
    });
  }

  ngOnInit() {
    this.tree.children = this.files;
  }

  public handleSelect(event) {
    if (!event.node.children) {
      this.tabEditingService.notifyFileStore({
        title: event.node.node.value, path: event.node.node.path,
        id: event.node.node.id, hasChildren: event.node.children
      });
    }
  }

  public handleRemove(event) {
    if (event.node.value) {
      let currentNode = event.node;
      if (confirm("Do you want to delete this element?")) {
        this.filesEditingService.fireFileAction({ type: "delete", node: event.node })
      } else {
        currentNode.parent.addChild(currentNode);
      }
    }
  }

  public handleRename(event) {
    let oldName = event.oldValue;
    let newName = event.newValue;
    let currentId = event.node.node.id;

    for (let index = 0; index < event.node.parent.children.length; index++) {
      if (event.node.parent.children[index].node.id !== currentId &&
        event.node.parent.children[index].node.value === newName) {
        event.node.node.value = oldName;
        alert("A file with this name already exists in the current folder");
        return;
      }
    }

    this.filesEditingService.fireFileAction({ type: "rename", node: event.node.node });
  }

  public handleCreate(event) {
    let [filename, extension] = event.node.value.split(".");
    let parentId = event.node.parent.node.id;
    let path = event.node.parent.node.path + "/" + event.node.parent.node.value;
    let isDirectory = false;

    if (!filename) {
      alert("File name could not be empty");
      return;
    }

    if (event.node.children) {
      for (let index = 0; index < event.node.parent.children.length; index++) {
        if (event.node.parent.children[index].node.value === event.node.value
          && event.node.parent.children[index].node.children !== null
          && event.node.parent.children[index].node.id !== event.node.id) {
          event.node.parent.removeChild(event.node);
          alert("A directory with this name already exists in the current folder");
          return;
        }
      }

      isDirectory = true;

    } else {
      if (!extension || extension !== 'c') {
        alert("Extension not valid - could be: c");
        event.node.parent.removeChild(event.node);
        return;
      }

      for (let index = 0; index < event.node.parent.children.length; index++) {
        if (event.node.parent.children[index].node.value === event.node.value
          && event.node.children === null
          && event.node.parent.children[index].node.id !== event.node.id) {
          event.node.parent.removeChild(event.node);
          alert("A file with this name already exists in the current folder");
          return;
        }
      }
    }

    this.filesEditingService.fireFileAction({
      type: "create", node: event.node.value, parent: parentId,
      directory: isDirectory, tree: this.files, path: path,
      oldId: event.node.id
    })
  }

  public handleMoved(event) {
    console.log('moved ' + event.node.value);
  }

}
