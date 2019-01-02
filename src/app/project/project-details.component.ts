import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GridDataResult, GridComponent, PageChangeEvent, SelectableSettings, SelectAllCheckboxState} from '@progress/kendo-angular-grid';
import { ProjectService } from '../_services/project.service';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import {map} from 'rxjs/operators/map';
import {process, State} from '@progress/kendo-data-query';

@Component({
  selector: 'app-project-details',
  providers: [ProjectService],
  template: `
    <button kendoButton (click)="onButtonClick()" class="btn btn-success">Save Selection</button>
    <kendo-grid [data]="view | async"
    [loading]="view.loading"
    [pageSize]="5" [skip]="skip"
    [pageable]="true"
    [scrollable]="'none'"
    [selectable]="{ checkboxOnly: true, mode: 'multiple' }"
    [kendoGridSelectBy]="'id'"
    [selectedKeys]="projectSelection"
    (selectedKeysChange)="onSelectedKeysChange($event)"
    (pageChange)="pageChange($event)"   
    >      
      <kendo-grid-checkbox-column title="Action" width="50"></kendo-grid-checkbox-column>
      <kendo-grid-column field="projectAbbr" title="Project Name" width="100"></kendo-grid-column>
      <kendo-grid-column field="projectDesc" title="Project Description" width="200"></kendo-grid-column>
    </kendo-grid>
  `
})
export class ProjectDetailComponent implements OnInit {

  /**
   * The category for which details are displayed
   */
  @Input() public project: Object;

  public view: Observable<GridDataResult>;
  public skip = 0;
  public items: Observable<any[]>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public projectSelection: number[] = [];
  public selectAllState: SelectAllCheckboxState = 'unchecked';
  public checkboxOnly = false;
  public mode = 'multiple';
  public selectableSettings: SelectableSettings;

  constructor(private service: ProjectService) {
    // this.setSelectableSettings();
  }
/**
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode
    };
  }**/

  public ngOnInit(): void {
    this.view = this.service.pipe(map(data => process(data, this.gridState)));
    this.items = this.service.fetch();
    this.service.read();
  }

  public onButtonClick() {
    alert('hi');
  }

  public onSelectedKeysChange(e) {
    const len = this.projectSelection.length;

    if (len === 0) {
      this.selectAllState = 'unchecked';
    } else if (len > 0 && len < this.items.length) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = 'checked';
    }
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.service.getProjects();
  }
}
