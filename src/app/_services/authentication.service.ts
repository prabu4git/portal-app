import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {first, map} from 'rxjs/operators';

@Injectable()
export class AuthenticationService {

  private authUrl = 'http://localhost:8080/user-portal/oauth/token';
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {

    const base64Credential: string = btoa( 'devglan-client:devglan-secret');
    const body = 'grant_type=password&username=' + username + '&password=' + password;
    /** const body = JSON.stringify({
      'username': username,
      'password': password,
      'grant_type': 'password'
    });**/

    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'grant_type': 'password',
          'Authorization': 'Basic ' + base64Credential,
          'Access-Control-Expose-Headers': 'Authorization',
          'Access-Control-Allow-Origin': 'http://localhost:4200/',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Credentials': 'true'
     }
      )
    };

    return this.http.post<any>(this.authUrl, body, httpOptions)
      .pipe(map(uAuth => {
        // login successful if there's a jwt token in the response
        if (uAuth && uAuth.access_token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('access_token', uAuth.access_token);
          localStorage.setItem('token_type', JSON.stringify(uAuth.token_type));
          localStorage.setItem('refresh_token', JSON.stringify(uAuth.refresh_token));
          localStorage.setItem('email', JSON.stringify(username));
        }
        return uAuth;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
  }
}
