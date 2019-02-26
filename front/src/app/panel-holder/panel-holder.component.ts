import { Component, OnInit, TemplateRef, ContentChild, Input } from '@angular/core';
import { TabEditingServiceService } from '../tab-editing-service.service';

@Component({
  selector: 'app-panel-holder',
  templateUrl: './panel-holder.component.html',
  styleUrls: ['./panel-holder.component.css']
})
export class PanelHolderComponent implements OnInit {

  @Input() panel: String;

  constructor(private tabEditingService: TabEditingServiceService) {
    this.tabEditingService.menuPanel$.subscribe(payload => {
      this.panel = payload;
    })
  }

  ngOnInit() {
  }

}
