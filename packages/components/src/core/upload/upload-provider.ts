import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';

import { NcNoopUploadHandler } from './noop-upload-handler';
import { NcUploadHandler } from './upload-handler';

export function withFileUploader<T, E>(uploader?: Type<NcUploadHandler<T, E>>) : EnvironmentProviders {

  return makeEnvironmentProviders([
    { provide: NcUploadHandler, useClass: uploader || NcNoopUploadHandler }
  ]);
}
