import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-base-url.token';

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

@Injectable()
export abstract class ApiService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = inject(API_BASE_URL);

  protected resource(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  protected get<T>(path: string, params?: QueryParams): Observable<T> {
    return this.http.get<T>(this.resource(path), {
      params: this.toHttpParams(params),
    });
  }

  protected post<TBody, TResponse = TBody>(path: string, body: TBody): Observable<TResponse> {
    return this.http.post<TResponse>(this.resource(path), body);
  }

  protected put<TBody, TResponse = TBody>(path: string, body: TBody): Observable<TResponse> {
    return this.http.put<TResponse>(this.resource(path), body);
  }

  protected patch<TBody, TResponse = TBody>(path: string, body: TBody): Observable<TResponse> {
    return this.http.patch<TResponse>(this.resource(path), body);
  }

  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.resource(path));
  }

  protected toHttpParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();

    for (const [key, value] of Object.entries(params ?? {})) {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    }

    return httpParams;
  }
}
