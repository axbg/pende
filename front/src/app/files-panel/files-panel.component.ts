import { Component, OnInit } from '@angular/core';
import { TreeModel, Ng2TreeSettings } from 'ng2-tree';

@Component({
  selector: 'app-files-panel',
  templateUrl: './files-panel.component.html',
  styleUrls: ['./files-panel.component.css']
})

export class FilesPanelComponent implements OnInit {

  private dynamicChildrenExample = [
    { value: 'first_children', id: 1 },
    {
      value: 'second_children', range: 3, children: [
        {
          value: 'asd'
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

  constructor() {
  }

  ngOnInit() {
    this.tree.children = this.dynamicChildrenExample;

    this.tree.children.forEach(child => {
      console.log(child);
    })
  }

  public handleSelected(event) {
    console.log("selected " + event.node.value);
  }

  public handleRemoved(event) {
    console.log(event);
    let currentNode = event.node;
    if (confirm("Do you want to delete this element?")) {
      console.log('deleted ' + event.node.value);
    } else {
      currentNode.parent.addChild(currentNode);
    }
  }

  public handleRename(event) {
    console.log("want to rename " + event.node.value);
  }

  public handleCreate(event) {
    if (event.node.children) {
      console.log("created new folder with parent: " + event.node.parent.value);
    } else {
      console.log("created new file with parent: " + event.node.parent.value);
    }
  }

  public handleMoved(event) {
    console.log('moved ' + event.node.value);
  }

}
