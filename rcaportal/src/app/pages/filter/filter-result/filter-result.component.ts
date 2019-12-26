import { Component, OnInit } from '@angular/core';
import { RcaDetailPanelService } from 'src/app/services/rca-detail-panel.service';

@Component({
  selector: 'app-filter-result',
  templateUrl: './filter-result.component.html',
  styleUrls: ['./filter-result.component.css']
})
export class FilterResultComponent implements OnInit {

  constructor(private detailPanelSrv: RcaDetailPanelService) { }

  ngOnInit() {
  }


  get isPanelOpen(){
    return this.detailPanelSrv.isPanelOpen;
  }

  get isPanelFixed(){
    return this.detailPanelSrv.isPanelFixed;
  }

  tiggerPanelStatus(){
    this.detailPanelSrv.tiggerPanelStatus();
  }
  triggerPanelPostion(){
    this.detailPanelSrv.triggerPanelPostion();
  }
}
