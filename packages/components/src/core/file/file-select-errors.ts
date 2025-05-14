export declare type NcFileError = NcFileTypeError | NcFileSizeError;

export class NcFileTypeError {
  constructor(
    public file: File,
    public type: string) { }
}

export class NcFileSizeError {
  constructor(
    public file: File,
    public limitSize: number,
    public limitSizeString?: string) { }
}
