import { Component, OnInit } from '@angular/core';
import { TreeModel } from 'ng2-tree';
import { TabEditingServiceService } from '../tab-editing-service.service';

@Component({
  selector: 'app-files-panel',
  templateUrl: './files-panel.component.html',
  styleUrls: ['./files-panel.component.css']
})

export class FilesPanelComponent implements OnInit {

  private dynamicChildrenExample = [
    { value: 'first_children', id: 1, URL: 'url1' },
    {
      value: 'second_children', id: 3, URL: 'url2', children: [
        {
          id: 15,
          value: 'asd',
          URL: 'url3'
        }
      ]
    }
  ];

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

  constructor(private tabEditingService: TabEditingServiceService) {
  }

  ngOnInit() {
    this.tree.children = this.dynamicChildrenExample;
  }

  public handleSelected(event) {
    console.log("selected " + event.node.value);
    if (!event.node.children) {
      this.tabEditingService.openNewTab(event.node.node.id, event.node.value);
    }
  }

  public handleRemoved(event) {
    if (event.node.value) {
      let currentNode = event.node;
      if (confirm("Do you want to delete this element?")) {
        console.log('deleted ' + event.node.value);
      } else {
        currentNode.parent.addChild(currentNode);
      }
    }
  }

  public handleRename(event) {
    console.log("want to rename " + event.node.value);
  }

  public handleCreate(event) {
    let [filename, extension] = event.node.value.split(".");
    let parentId = event.node.parent.node.id;

    if (!filename) {
      alert("File name could not be empty");
      return;
    }

    if (event.node.children) {
      //rest call with parentId
    } else {
      if (!extension || extension !== 'c') {
        alert("Extension not valid - could be: c");
        event.node.parent.removeChild(event.node);
        return;
      }
      //rest call with parentId
    }
  }

  public handleMoved(event) {
    console.log('moved ' + event.node.value);
  }

}
