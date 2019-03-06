import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Constants } from '../classes/Constants';

@Injectable({
  providedIn: 'root'
})
export class HTTPManagerService {

  constructor(private http: HttpClient) { }

  public apiCall(URL: String, METHOD: String, BODY?: any) {
    let body;

    if (BODY) {
      body = new HttpParams({ fromObject: BODY });
    }

    switch (METHOD) {
      case Constants.GET_METHOD:
        return this.http.get(Constants.BASE_URL + URL);
      case Constants.POST_METHOD:
        return this.http.post(Constants.BASE_URL + URL, { body: body });
      case Constants.PUT_METHOD:
        return this.http.put(Constants.BASE_URL + URL, { body: body });
      case Constants.DELETE_METHOD:
        return this.http.delete(Constants.BASE_URL + URL);
    }
  }

}
