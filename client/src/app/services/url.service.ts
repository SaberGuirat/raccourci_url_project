import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UrlI } from '../interfaces/url.interface';
import { Url } from 'url';
@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  generate(url: string): Observable<any> {
    return this.http
      .post(`${environment.BASE_URL}/api/url/short`, { longUrl: url })
      .pipe(catchError(this.errorHandlerService.handleError));
  }

  getUserUrls(): Observable<UrlI[]> {
    return this.http
      .get<UrlI[]>(`${environment.BASE_URL}/api/url/all`)
      .pipe(catchError(this.errorHandlerService.handleError));
  }

  visitUrl(code: string): Observable<UrlI> {
    console.log(`${environment.BASE_URL}/api/url/visit/${code}`);
    return this.http
      .get<UrlI>(`${environment.BASE_URL}/api/url/visit/${code}`)
      .pipe(catchError(this.errorHandlerService.handleError));
  }

  delete(id: string): Observable<UrlI> {
    return this.http
      .delete<UrlI>(`${environment.BASE_URL}/api/url/delete/${id}`)
      .pipe(catchError(this.errorHandlerService.handleError));
  }
}
