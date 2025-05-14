import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { NcUploadHandler } from './upload-handler';

@Injectable()
export class NcNoopUploadHandler extends NcUploadHandler<any, string> {

  getRequestData(file: File | Blob) { return file; }

  getResponseData(body: any) { return body; }

  getErrorMessage(error: HttpErrorResponse) { return error.statusText; }
}
