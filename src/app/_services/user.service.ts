import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from '../_models/user.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';



@Injectable()
export class UserService extends BehaviorSubject<any[]> {
  access_token: string;
  userUrl: string;
  customUrl = 'http://localhost:8080/user-portal/users';
  constructor(private http: HttpClient) {
    super([]);
  }
  private data: any[] = [];

  public read() {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.fetch().pipe(
        tap(data => {
          this.data = data;
        })
      ).subscribe(data => {
        super.next(data);
      console.log(this.data);
      });

  }

  private reset() {
    this.data = [];
  }

  private fetch(): Observable<any[]> {
     return this.http.get<User[]>(this.customUrl);
  }




  public getUsers() {
    return this.http.get<User[]>(this.customUrl);
  }


  public deleteUser(user) {
    this.http.delete<User[]>(this.customUrl + '/' + user.id).subscribe(val => {
      console.log('Delete call successful.', val);
    }, response => {
      console.log('User delete call in error', response);
    }, () => {
      console.log('Delete call is now completed');
      this.reset();
      this.fetch().subscribe(() => this.read(), () => this.read());
    });
  }


  public register(user: User) {
    this.http.post<User>(this.customUrl, user).subscribe(val => {
      console.log('post call successful value returned in body', val);
    }, response => {
      console.log('post call in error', response);
    }, () => {
      console.log('The post observable is now completed.');
      this.reset();
      this.fetch().subscribe(() => this.read(), () => this.read());
    });
  }

  public update(user: User) {
    // const gheaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json' , 'Authorization': 'Bearer ' + this.access_token});
     this.http.put(this.customUrl + '/' + user.id, user).subscribe(val => {
      console.log('put call successful value returned in body', val);
    }, response => {
      console.log('put call in error', response);
    }, () => {
      console.log('The put observable is now completed.');
       this.reset();
       this.fetch().subscribe(() => this.read(), () => this.read());
    });

  }
}
