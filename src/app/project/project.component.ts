import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Project } from '../_models/project.model';
import { ProjectService } from '../_services/project.service';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators/map';


const projectFormGroup = dataItem => new FormGroup({
  'id': new FormControl(dataItem.id),
  'projectDesc': new FormControl(dataItem.projectDesc, Validators.required),
  'projectAbbr': new FormControl(dataItem.projectAbbr, Validators.required),
  'purchaseOrder': new FormControl(dataItem.purchaseOrder, Validators.required)
});


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})


export class ProjectComponent implements OnInit {
  projects: Project[];
  public gridData: Observable<GridDataResult>;
  public names: any[];
  public formGroup: FormGroup;
  private editedRowIndex: number;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  constructor(private router: Router, private projectService: ProjectService) {

  }
  ngOnInit() {
     this.gridData = this.projectService.pipe(map(data => process(data, this.gridState)));
     this.projectService.read();

  }







  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.formGroup = projectFormGroup({
      'projectDesc': '',
      'projectAbbr': '',
      'purchaseOrder': '',
      'id': 0
    });

    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = projectFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const project = formGroup.value;
    if (project.id === 0) {
      this.projectService.register(project);
    } else {
      this.projectService.update(project);
    }
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }): void {
    this.projectService.deleteProject(dataItem);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }


}
