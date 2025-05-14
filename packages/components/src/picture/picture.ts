import 'blueimp-load-image';

import { transition, trigger } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Inject,
  inject,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
  fadeIn,
  fadeOut,
  NcFileModule,
  NcFileSizeError,
  NcFileTypeError,
  NcUploadError,
  NcUploadEvent,
  NcUploadHandler,
  NcUploadRef,
  NcUploadResponse,
  NcUploadStatus,
} from '@oceanstar/components/core';
import { NcFormFieldControl } from '@oceanstar/components/forms';
import { NcModalModule, NcModalService } from '@oceanstar/components/modal';

import { NcProgressModule } from '../progress';
import { DEFAULT_PICTURE_ICONS, NC_PICTURE_ICONS, NtPictureIcons } from './picture-icons';

/**
 * 压缩图片
 */
export function zipImage(file: File, option: any = { maxWidth: 1080, orientation: true, canvas: true }): Promise<{ thumbnail: string; blob: Blob }> {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    loadImage(
      file,
      (canvas: Event | HTMLCanvasElement | HTMLImageElement) => {
        if (canvas instanceof HTMLCanvasElement) {
          canvas.toBlob((blob: any) => {
            let thumbnail = canvas.toDataURL('image/png');
            blob.lastModifiedDate = new Date();
            blob.lastModified = blob.lastModifiedDate.getTime();
            resolve({ thumbnail, blob });
          });
        } else {
          reject('HTMLCanvasElement toBlob function is undefined');
        }
      },
      option,
    );
  });
}

let uniqueId = 0;

export const NC_PICTURE_ACCEPTS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/svg+xml', 'image/webp'];

export declare type NcPictureError<E> = NcFileTypeError | NcFileSizeError | NcUploadError<E>;

export class NcPictureRef<T, E> extends NcUploadRef<T, E> {
  thumbnail!: string;
  constructor(
    public override file: File,
    public override id: string = `nc-picture-${uniqueId++}`,
  ) {
    super(file, file.name, file.size);
  }
}

@Component({
  imports: [CommonModule, NcFileModule, NcModalModule, NcProgressModule],
  selector: 'nc-picture',
  templateUrl: 'picture.html',
  host: {
    class: 'nc-picture',
    '[class.disabled]': 'disabled',
    '[class.readonly]': 'readonly',
  },
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NcFormFieldControl, useExisting: NcPicture }],
  animations: [
    trigger('fade', [transition('* => void', fadeOut(0.3)), transition('void => *', fadeIn(0.3))]),
    trigger('fadeOut', [transition('* => void', fadeOut(0.3))]),
  ],
})
export class NcPicture<T, E = string> implements OnInit, ControlValueAccessor, NcFormFieldControl<NcPictureRef<T, E>[]> {
  private _destroyRef = inject(DestroyRef);

  private _accept = NC_PICTURE_ACCEPTS.join(',');

  _displayPictureRefs: NcPictureRef<T, E>[] = [];

  private _pictureRefs: NcPictureRef<T, E>[] = [];

  get value() {
    return this._pictureRefs;
  }

  private _isFulled = false;

  get isFulled() {
    return this._isFulled;
  }

  private _disabled = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }

  private _readonly = false;

  @Input()
  get readonly() {
    return this._readonly;
  }
  set readonly(value: BooleanInput) {
    this._readonly = coerceBooleanProperty(value);
  }

  private _notrigger = false;

  /**
   * @deprecated 即将废弃
   */
  @Input()
  get notrigger() {
    return this._notrigger;
  }
  set notrigger(value: BooleanInput) {
    this._notrigger = coerceBooleanProperty(value);
  }

  private _required = false;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }

  @Input()
  get accept() {
    return this._accept;
  }
  set accept(value: string | Array<string>) {
    if (typeof value === 'string') {
      if (value === '*') {
        this._accept = NC_PICTURE_ACCEPTS.join(',');
      } else {
        this._accept = value.replace(' ', '');
      }
    } else {
      this._accept = value.join(',');
    }
  }

  private _multiple = false;

  get multiple() {
    return this._multiple;
  }

  private _limitSize = Number.MAX_VALUE;

  @Input()
  get limitSize() {
    return this._limitSize;
  }
  set limitSize(value: number) {
    this._limitSize = coerceNumberProperty(value, 5);
  }

  private _maxFiles = 1;

  @Input()
  get maxFiles() {
    return this._maxFiles;
  }
  set maxFiles(value: number) {
    this._maxFiles = coerceNumberProperty(value, 1);
    this._checkMultipleableSelector();
  }

  @Input() url: string = '';

  @Input() name: string = '';

  @Input() shape: '' | 'circle' | 'square' = '';

  @ViewChild('previewTemplate', { static: true })
  previewTemplate!: TemplateRef<any>;

  @Output() errors = new EventEmitter<E | E[]>();

  private _onChange: (value: any) => void = () => {};

  private _onTouched = () => {};

  constructor(
    private _modal: NcModalService,
    @Optional() private _uploadHandler: NcUploadHandler<T, E>,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() @Inject(NC_PICTURE_ICONS) public icons: NtPictureIcons,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.icons = { ...DEFAULT_PICTURE_ICONS, ...icons };
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.errors.complete();
  }

  writeValue(value: NcPictureRef<T, E>[]) {
    if (value) {
      const surplusCount = this.maxFiles - this._displayPictureRefs.length;
      if (value.length > surplusCount) {
        value = value.splice(0, surplusCount);
      }
      this._pictureRefs.splice(0, this._pictureRefs.length, ...value);
      this._displayPictureRefs.splice(0, this._displayPictureRefs.length, ...value);
      this._setTriggerVisible();
    }
  }

  registerOnChange(fn: (_: any) => {}) {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}) {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this._disabled = isDisabled;
  }

  preview(pictureRef: NcPictureRef<T, E>) {
    this._modal.open(this.previewTemplate, {
      data: pictureRef,
      centerVertically: true,
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: 'auto',
      transparent: true,
    });
  }

  _select(files: FileList) {
    const surplusCount = this.maxFiles - this._displayPictureRefs.length;
    const maxLength = files.length > surplusCount ? surplusCount : files.length;

    for (let index = 0; index < maxLength; index++) {
      this._displayPictureRefs.push(this._createPictureRef(files[index]));
    }

    this._setTriggerVisible();
    this._onTouched && this._onTouched();
  }

  _remove(pictureRef: NcPictureRef<T, E>) {
    if (this.disabled) {
      return;
    }

    this._removePictureRef(pictureRef);
    this._onChange(this.value);
  }

  private _createPictureRef(file: File) {
    const pictureRef = new NcPictureRef<T, E>(file);

    zipImage(file).then(data => (pictureRef.thumbnail = data.thumbnail));

    pictureRef.subscription = this._uploadHandler
      .upload(this.url, pictureRef)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(event => this._resolveUploadedResult(pictureRef, event));

    return pictureRef;
  }

  private _removePictureRef(pictureRef: NcPictureRef<T, E>) {
    if (pictureRef.subscription && !pictureRef.subscription.closed) {
      pictureRef.subscription.unsubscribe();
    }

    if (this._pictureRefs.includes(pictureRef)) {
      const index = this._pictureRefs.indexOf(pictureRef);
      this._pictureRefs.splice(index, 1);
    }

    if (this._displayPictureRefs.includes(pictureRef)) {
      const displayIndex = this._displayPictureRefs.indexOf(pictureRef);
      this._displayPictureRefs.splice(displayIndex, 1);
    }

    this._setTriggerVisible();
  }

  private _resolveUploadedResult(pictureRef: NcPictureRef<T, E>, event: NcUploadEvent<T, E>) {
    if (event instanceof NcUploadResponse) {
      pictureRef.data = event.data;
      this._pictureRefs.push(pictureRef);
    } else {
      pictureRef.status = NcUploadStatus.ERROR;
      pictureRef.error = event.error;
      pictureRef.progress = 100;
      this.errors.next(event.error);
    }
    this._onChange(this.value);
  }

  private _checkMultipleableSelector() {
    if (this.maxFiles > 1) {
      this._multiple = true;
    } else {
      this._multiple = false;
    }
  }

  private _setTriggerVisible() {
    this._isFulled = this._displayPictureRefs.length >= this.maxFiles;
  }

  // private _coerceAccpetRange(array: Array<string>) {
  //   return array.filter(accept => NC_PICTURE_ACCEPTS.indexOf(accept) > -1);
  // }
}
