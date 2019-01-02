import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models/user.model';
import { UserService } from '../_services/user.service';

@Component({
  templateUrl: './add-user.component.html'
})
export class AddUserComponent {

  user: User = new User();

  constructor(private router: Router, private userService: UserService) {

  }

}
