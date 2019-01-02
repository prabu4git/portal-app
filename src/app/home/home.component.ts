import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService } from '../_services';



@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
  access_token: string;
  email: string;
  users: User[] = [];
  currentUser: User;
  constructor(private userService: UserService) {
    this.access_token = localStorage.getItem('access_token');
    this.email = JSON.parse(localStorage.getItem('email'));
  }

  ngOnInit() {
    this.loadAllUsers();
  }

 private loadAllUsers() {
    this.userService.getUsers().pipe(first()).subscribe(users => {
      this.users = users;
      this.currentUser = this.users.filter(u => u.email === this.email)[0];
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    });

  }
}
