import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { LocalStorageService } from './local-storage.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject(null);
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  register(user: User) {
    return this.http
      .post<User>(
        `${environment.BASE_URL}/api/user/register`,
        user,
        httpOptions
      )
      .pipe(catchError(this.errorHandlerService.handleError));
  }
  login(user: User) {
    return this.http
      .post<User>(`${environment.BASE_URL}/api/user/login`, user)
      .pipe(
        tap((data) => {
          this.user$.next(data);
          this.setToken('token', data.access_token);
          this.setToken('refreshToken', data.refresh_token);
        }),
        catchError(this.errorHandlerService.handleError)
      );
  }
  logout(): void {
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('refreshToken');
    this.user$.next(null);
    this.router.navigateByUrl('/');
  }

  refreshToken(): Observable<User> {
    const refresh_token = this.localStorageService.getItem('refreshToken');

    return this.http
      .post<User>(`${environment.BASE_URL}/api/user/refresh_token`, {
        refresh_token,
      })
      .pipe(
        tap((res) => {
          this.user$.next(res);
          this.setToken('token', res.access_token);
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.user$.pipe(
      switchMap((user) => {
        // check if we already have user data
        if (user) {
          return of(user);
        }

        const token = this.localStorageService.getItem('token');
        // if there is token then fetch the current user
        if (token) {
          return this.refreshToken();
        }

        return of(null);
      })
    );
  }

  private setToken(key: string, token: string): void {
    this.localStorageService.setItem(key, token);
  }
}
