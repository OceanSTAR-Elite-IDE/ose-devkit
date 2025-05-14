import { Observable, of } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { NcUploadError, NcUploadResponse } from './upload-models';
import { NcUploadRef, NcUploadStatus } from './upload-ref';

const REQUEST_PROGRESS = { reportProgress: true };

export declare type NcUploadEvent<T, E> = NcUploadResponse<T> | NcUploadError<E>;

@Injectable()
export abstract class NcUploadHandler<T, E> {

  constructor(protected http: HttpClient) { }

  /**
   * 文件上传
   * @param url 上传 url
   * @param uploadRef 上传任务对象
   */
  upload(url: string, uploadRef: NcUploadRef<T, E>): Observable<NcUploadEvent<T, E>> {

    const data = this.getRequestData(uploadRef.file);

    return this.http.request<T>(new HttpRequest('POST', url, data, REQUEST_PROGRESS))
      .pipe(
        map(event => this._progress(event, uploadRef)),
        filter(event => event.type === HttpEventType.Response),
        map((event: HttpEvent<T>) =>
          new NcUploadResponse<T>(this.getResponseData((event as HttpResponse<T>).body)),
        ),
        catchError((error: HttpErrorResponse) =>
          of(new NcUploadError(uploadRef.file, this.getErrorMessage(error)))
        )
    );
  }

  /**
   * 处理上传任务的进度
   * @param event 上传事件
   * @param uploadRef 上传任务
   */
  protected _progress<T>(event: HttpEvent<any>, uploadRef: NcUploadRef<T, E>) {
    if (event.type === HttpEventType.Sent) {
      /** 开始 */
      uploadRef.status = NcUploadStatus.BEGIN;
    } else if (event.type === HttpEventType.UploadProgress && (event.total && event.total > 0)) {
      /** 进度更新 */
      uploadRef.progress = Math.round(event.loaded / event.total * 100);
      uploadRef.status = NcUploadStatus.SENDING;
    } else if (event.type === HttpEventType.Response) {
      /** 结束 */
      if(event.status >= 400) {
        uploadRef.status = NcUploadStatus.ERROR;
      } else {
        uploadRef.status = NcUploadStatus.UPLOADED;
      }
    }

    return event;
  }

  /**
   * 获取文件上传数据格式
   * @param file 上传文件
   */
  abstract getRequestData(file: File | Blob | null): any;

  /**
   * 获取文件上传结束响应数据
   * @param response 响应数据
   */
  abstract getResponseData(body: any): T;

  /**
   * 获取文件上传结束错误数据
   * @param error 错误
   */
  abstract getErrorMessage(error: any): E;
}
