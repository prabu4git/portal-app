import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../_models/user.model';
import { UserService } from '../_services/user.service';
import { Observable } from 'rxjs/Observable';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators/map';


const createFormGroup = dataItem => new FormGroup({
  'id': new FormControl(dataItem.id),
  'firstName': new FormControl(dataItem.firstName, Validators.required),
  'lastName': new FormControl(dataItem.lastName, Validators.required),
  'email': new FormControl(dataItem.email, Validators.required),
  'roles': new FormControl(dataItem.roles[0] === undefined ? 0 : dataItem.roles[0].id, Validators.required),
  'street': new FormControl(dataItem.street),
  'unit': new FormControl(dataItem.unit),
  'city': new FormControl(dataItem.city),
  'state': new FormControl(dataItem.state),
  'country': new FormControl(dataItem.country),
  'zipCode': new FormControl(dataItem.zipCode),
  'phone': new FormControl(dataItem.phone, Validators.required)
});



@Component({selector: 'app-user',
    templateUrl: './user.component.html', styleUrls: ['./user.component.css']
})




export class UserComponent implements OnInit, AfterViewInit {
  users: User[];
  public gridData: Observable<GridDataResult>;
  public names: any[];
  public formGroup: FormGroup;
  private editedRowIndex: number;
  @ViewChild(GridComponent) grid: GridComponent;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public roles: any[] = [
    {
      'id': 0,
      'role': 'Not Assigned'
    },
    {
      'id': 1,
      'role': 'Administrator'
    },
    {
      'id': 2,
      'role': 'Employee'
    }
  ];
  constructor(private router: Router, private userService: UserService) {

  }
  ngOnInit() {
  /*  this.userService.getUsers()
      .subscribe( data => {
        this.users = data;
        this.gridData = data;
      });
*/
    this.gridData = this.userService.pipe(map(data => process(data, this.gridState)));
    this.userService.read();
  }

  public ngAfterViewInit(): void {
    // Expand the first row initially
    this.grid.expandRow(0);
  }

  public role(id: number): any {
    return this.roles.find(x => x.id === id);
  }




  public onRoleChanage(e) {

  }


  public onStateChange(state: State) {
    this.gridState = state;
    this.gridData = this.userService.pipe(map(data => process(data, this.gridState)));
    this.userService.read();
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.formGroup = createFormGroup({
      'firstName': '',
      'lastName': '',
      'email': '',
      'roles': 0,
      'street': '',
      'unit': '',
      'city': '',
      'state': '',
      'country': '',
      'zipCode': '',
      'phone': '',
      'id': 0
    });

    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const user = formGroup.value;
    console.log('--------------------' + user.roles);
    user.roles = [this.roles[user.roles]];
    console.log('----------' + JSON.stringify(user));
    if (user.id === 0) {
      this.userService.register(user);
    } else {
      this.userService.update(user);
    }
    sender.closeRow(rowIndex);
 }

  public removeHandler({ dataItem }): void {
     this.userService.deleteUser(dataItem);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }


}


