import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpHeaders, HttpRequest, HttpHandler, HttpEvent, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomHttpInterceptor implements HttpInterceptor {

  headerInfo?: HttpHeaders;
  exceptUrls: string[] = [
    'http://175.114.176.195:8090/api/system/user/login',
    'http://localhost:8090/api/system/user/login',      // 로그인페이지 url
    'http://localhost:8090/api/system/file',           // 파일업로드 url
    'http://localhost:8090/api/system/user/image',      // 프로필 이미지 url
    'http://localhost:8090/api/hrm/staff/changeimage'   // 직원 사진 url
  ];

  private tokenExtractor = inject(HttpXsrfTokenExtractor);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headerName = 'XSRF-TOKEN';
    const token = this.tokenExtractor.getToken() as string;

    if (token !== null && !req.headers.has(headerName)) {
      req = req.clone({ headers: req.headers.set(headerName, token) });
    }

    if (this.isExceptUrl(req.url)) {
      return next.handle(req);
    } else {
      req = this.setParameters(req);
    }

    return next.handle(req);
  }

  isExceptUrl(url: string): boolean {
    for (const urlString of this.exceptUrls) {
      if (urlString === url) return true;
    }
    return false;
  }

  setParameters(req: HttpRequest<any>): HttpRequest<any> {
    if (req.method.toLowerCase() === 'get' || req.method.toLowerCase() === 'delete') {
      req = this.setParamsGET(req);
    } else if (req.method.toLowerCase() === 'post') {
      if (req.body instanceof FormData) {
        req =  this.setFormDataBodyPOST(req);
      } else {
        req = this.setBodyPOST(req);
      }
    }

    return req;
  }

  private setParamsGET(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      params: req.params.set('companyCode', String(sessionStorage.getItem('companyCode')))
    });
  }

  private setBodyPOST(req: HttpRequest<any>): HttpRequest<any> {
    // 배열일 경우 객체에 속성 추가
    if (Array.isArray(req.body)) {
      for (var rec of req.body) {
        rec.companyCode = String(sessionStorage.getItem('companyCode'));
        rec.clientAppUrl = window.location.href;
      }
      return req;
    }

    return req.clone({
      body: { ...req.body, companyCode: String(sessionStorage.getItem('companyCode')), clientAppUrl: window.location.href }
    });
  }

  private setFormDataBodyPOST(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      body: req.body.append('companyCode', String(sessionStorage.getItem('companyCode')))
                    .append('clientAppUrl', window.location.href)
    });
  }

}
