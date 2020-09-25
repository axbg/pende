import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy, AfterViewInit
} from '@angular/core';
import { TreeModel } from 'ng2-tree';
import { TabEditingServiceService } from 'src/app/services/tab-editing-service.service';
import { FilesEditingService } from 'src/app/services/files-editing.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-files-panel',
  templateUrl: './files-panel.component.html',
  styleUrls: ['./files-panel.component.css'],
})
export class FilesPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  private tree: TreeModel = {
    value: 'projects',
    path: '',
    settings: {
      static: false,
      rightMenu: true,
      leftMenu: false,
      cssClasses: {
        expanded: 'pi pi-angle-down margin clickable',
        collapsed: 'pi pi-angle-right margin clickable',
        leaf: 'nothing',
        empty: 'pi pi-circle-off margin clickable',
      },
      templates: {
        node: '<i class="pi pi-folder clickable"></i>',
        leaf: '<i class="pi pi-file clickable"></i>',
        leftMenu: '<i></i>',
      },
    },
  };

  @Input()
  files: any;

  currentFilePath: any;

  @Input()
  themeColor: String;

  @ViewChild('treeComponent')
  treeComponent;

  updateFileIdFiredSubscription: ISubscription;

  constructor(
    private tabEditingService: TabEditingServiceService,
    private filesEditingService: FilesEditingService
  ) {
    this.updateFileIdFiredSubscription = this.filesEditingService.updateFileIdFired$.subscribe(
      (file) => {}
    );
  }

  ngOnInit() {
    this.tree.children = this.files;
  }

  ngAfterViewInit() {
    this.stopItemsDragging();
  }

  stopItemsDragging() {
    const items: any = document.querySelectorAll('.value-container');

    items.forEach(node => {
      const n: HTMLElement = node;
      n.setAttribute('draggable', 'false');
      n.style.userSelect = 'none';
    });
  }

  public handleSelect(event) {
    if (!event.node.children) {
      const path = this.composeWholePath(event.node);
      this.tabEditingService.notifyFileStore({
        title: event.node.node.value,
        path: path,
        id: event.node.node.id,
        hasChildren: event.node.children,
      });
    }
  }

  public handleRemove(event) {
    if (event.node.value) {
      const currentNode = event.node;

      if (event.node.value === 'projects' && event.node.node.path === '') {
        alert('You nasty! Root directory cannot be deleted!');
        return;
      }

      if (confirm('Do you want to delete this element?')) {
        const path = this.composeWholePath(event.node);
        this.files = this.updateTreeModelAndAppendPath(
          this.treeComponent.tree,
          -1
        ).children;
        this.filesEditingService.fireFileAction({
          type: 'delete',
          node: event.node.value,
          files: this.files,
          path: path,
        });
      } else {
        currentNode.parent.addChild(currentNode);
      }
    }
  }

  public handleRename(event) {
    const oldName = event.oldValue;
    const newName = event.newValue;
    const currentId = event.node.node.id;

    if (oldName === 'projects' && event.node.node.path === '') {
      alert('You nasty! Root directory cannot be renamed');
      event.node.node.value = oldName;
      return;
    }

    for (let index = 0; index < event.node.parent.children.length; index++) {
      if (
        event.node.parent.children[index].node.id !== currentId &&
        event.node.parent.children[index].node.value === newName
      ) {
        event.node.node.value = oldName;
        alert('A file with this name already exists in the current folder');
        return;
      }
    }

    if (!event.node.children) {
      const extension = newName.split('.')[1];
      if (!extension || (extension !== 'c' && extension !== 'cpp')) {
        alert('Extension not valid - could be: c or cpp');
        event.node.node.value = oldName;
        return;
      }
    }

    this.files = this.updateTreeModelAndAppendPath(
      this.treeComponent.tree,
      event.node.id
    ).children;
    this.filesEditingService.fireFileAction({
      type: 'rename',
      oldName: oldName,
      newName: newName,
      path: this.currentFilePath,
      files: this.files,
    });
  }

  public handleCreate(event) {
    const [filename, extension] = event.node.value.split('.');
    let isDirectory = false;

    if (!filename) {
      alert('File name could not be empty');
      return;
    }

    if (event.node.children) {
      for (let index = 0; index < event.node.parent.children.length; index++) {
        if (
          event.node.parent.children[index].node.value === event.node.value &&
          event.node.parent.children[index].node.children !== null &&
          event.node.parent.children[index].node.id !== event.node.id
        ) {
          event.node.parent.removeChild(event.node);
          alert(
            'A directory with this name already exists in the current folder'
          );
          return;
        }
      }

      isDirectory = true;
    } else {
      if (!extension || (extension !== 'c' && extension !== 'cpp')) {
        alert('Extension not valid - could be: c or cpp');
        event.node.parent.removeChild(event.node);
        return;
      }

      for (let index = 0; index < event.node.parent.children.length; index++) {
        if (
          event.node.parent.children[index].node.value === event.node.value &&
          event.node.children === null &&
          event.node.parent.children[index].node.id !== event.node.id
        ) {
          event.node.parent.removeChild(event.node);
          alert('A file with this name already exists in the current folder');
          return;
        }
      }
    }

    this.files = this.updateTreeModelAndAppendPath(
      this.treeComponent.tree,
      event.node.id
    ).children;
    this.filesEditingService.fireFileAction({
      type: 'create',
      node: event.node.value,
      directory: isDirectory,
      path: this.currentFilePath,
      id: event.node.id,
      files: this.files,
      content: '',
    });
  }

  composeWholePath(node) {
    let path = '';

    if (node.value !== 'projects') {
      let parent = node.parent;

      while (parent.value !== 'projects') {
        path = path + '/' + parent.value;
        parent = parent.parent;
      }

      path = '/projects' + path;
    }

    return path;
  }

  updateTreeModelAndAppendPath(tree, id) {
    const model: TreeModel = {
      value: '',
    };

    model.value = tree.node.value;

    model['path'] = this.composeWholePath(tree);

    if (tree.node['id'] === id) {
      this.currentFilePath = this.composeWholePath(tree);
    }

    model['id'] = tree.node['id'];
    if (tree.children) {
      model['children'] = [];
      tree.children.forEach((child) => {
        model['children'].push(this.updateTreeModelAndAppendPath(child, id));
      });
    }

    return model;
  }

  ngOnDestroy() {
    this.updateFileIdFiredSubscription.unsubscribe();
  }
}
