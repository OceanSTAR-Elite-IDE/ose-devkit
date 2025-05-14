import { Subscription } from 'rxjs';

export enum NcUploadStatus {
  BEGIN = 0,
  SENDING = 1,
  SUCCESS = 2,
  ERROR = 3,
  UPLOADED = 4,
}

export class NcUploadRef<T, E> {
  id?: string;
  type?: string;
  status!: NcUploadStatus;
  error?: E;
  link?: string;
  data?: T;
  progress?: number;
  subscription?: Subscription;

  constructor(
    public file: File | Blob | null,
    public name: string,
    public size: number
  ) {}
}
