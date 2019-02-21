import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-panel-holder',
  templateUrl: './panel-holder.component.html',
  styleUrls: ['./panel-holder.component.css']
})
export class PanelHolderComponent implements OnInit {

  @Input() private template : TemplateRef<any>;

  constructor() { }

  ngOnInit() {
    console.log(this.template);
  }

}
