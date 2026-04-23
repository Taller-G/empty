import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  ApiResponse,
} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getAll(onlyActive = false): Observable<User[]> {
    const params = new HttpParams().set('onlyActive', String(onlyActive));
    return this.http
      .get<ApiResponse<User[]>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: CreateUserPayload): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(this.baseUrl, payload)
      .pipe(map((res) => res.data));
  }

  update(id: string, payload: UpdateUserPayload): Observable<User> {
    return this.http
      .patch<ApiResponse<User>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
