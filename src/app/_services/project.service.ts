import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Project } from '../_models/project.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';



@Injectable()
export class ProjectService extends BehaviorSubject<any[]> {
  public loading = true;
  access_token: string;
  userUrl: string;
  customUrl = 'http://localhost:8080/user-portal/projects';
  constructor(private http: HttpClient) {
    super([]);
  }
  private data: any[] = [];

  public read() {
    this.loading = true;
    if (this.data.length) {
      return super.next(this.data);
    }
    this.fetch().pipe(tap(data => {this.data = data;})).subscribe(data => {super.next(data); });
  }

  private reset() {
    this.data = [];
  }

  public fetch(): Observable<any[]> {
     return this.http.get<Project[]>(this.customUrl);
  }

  public getProjects() {
    return this.http.get<Project[]>(this.customUrl);
  }

  public deleteProject(project) {
    this.http.delete<Project[]>(this.customUrl + '/' + project.id).subscribe(val => {
      console.log('Delete call successful.', val);
    }, response => {
      console.log('User delete call in error', response);
    }, () => {
      console.log('Delete call is now completed');
      this.reset();
      this.fetch().subscribe(() => this.read(), () => this.read());
    });
  }


  public register(project: Project) {
    this.http.post<Project>(this.customUrl, project).subscribe(val => {
      console.log('post call successful value returned in body', val);
    }, response => {
      console.log('post call in error', response);
    }, () => {
      console.log('The post observable is now completed.');
      this.reset();
      this.fetch().subscribe(() => this.read(), () => this.read());
    });
  }

  public update(project: Project) {
    // const gheaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json' , 'Authorization': 'Bearer ' + this.access_token});
     this.http.put(this.customUrl + '/' + project.id, project).subscribe(val => {
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
