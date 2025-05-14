export class NcUploadResponse<T> {
  constructor(public data: T) { }
}

export class NcUploadError<E> {
  constructor(public file: File | Blob | null, public error: E) { }
}
