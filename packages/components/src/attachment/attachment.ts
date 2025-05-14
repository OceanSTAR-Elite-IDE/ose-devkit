import { transition, trigger } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Inject, Input, OnInit, Optional, Output, Self, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
  fadeOut,
  findCategoryByExtensions,
  findCategoryByFile,
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
import { NcProgressModule } from '@oceanstar/components/progress';

import { DEFAULT_ATTACHMENC_ICONS, NC_ATTACHMENC_ICONS, NcAttachmentIcons } from './icons';

let uniqueId = 0;

export declare type NtAttachmentError = NcFileTypeError | NcFileSizeError | NcUploadError<any>;

export class NcAttachmentRef<T> extends NcUploadRef<T, any> {
  category: string;

  constructor(
    public override file: File,
    public override id: string = `nc-attachment-${uniqueId++}`,
  ) {
    super(file, file.name, file.size);
    this.category = findCategoryByFile(file) || 'default';
  }
}

@Component({
  imports: [CommonModule, NcFileModule, NcProgressModule],
  selector: 'nc-attachment, [nc-attachment]',
  templateUrl: 'attachment.html',
  host: {
    class: 'nc-attachment',
    '[class.disabled]': 'disabled',
    '[class.readonly]': 'readonly',
  },
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NcFormFieldControl, useExisting: NcAttachment }],
  animations: [trigger('fadeOut', [transition('* => void', fadeOut(0.3))])],
})
export class NcAttachment<T> implements OnInit, ControlValueAccessor, NcFormFieldControl<NcAttachmentRef<T>[]> {
  _displayAttachmentRefs: NcAttachmentRef<T>[] = [];

  private _attachmentRefs: NcAttachmentRef<T>[] = [];

  get value() {
    return this._attachmentRefs;
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

  private _accept = '*';

  @Input()
  set accept(value: string | Array<string>) {
    if (typeof value === 'string') {
      this._accept = value.replace(' ', '');
    } else {
      this._accept = value.join(',');
    }
  }
  get accept() {
    return this._accept;
  }

  private _multiple = true;

  @Input()
  get multiple() {
    return this._multiple;
  }
  set multiple(value: BooleanInput) {
    this._multiple = coerceBooleanProperty(value);
  }

  private _limitSize = Number.MAX_VALUE;

  @Input()
  get limitSize() {
    return this._limitSize;
  }
  set limitSize(value: number) {
    this._limitSize = coerceNumberProperty(value, 5);
  }

  @Input() url: string = '';

  @Input() name: string = '';

  @Output() errors = new EventEmitter<NtAttachmentError | NtAttachmentError[]>();

  private _onChange: (value: any) => void = () => {};

  private _onTouched = () => {};

  private _destroyRef = inject(DestroyRef);

  constructor(
    @Optional() private _uploadHandler: NcUploadHandler<T, any>,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() @Inject(NC_ATTACHMENC_ICONS) public icons: NcAttachmentIcons,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.icons = { ...DEFAULT_ATTACHMENC_ICONS, ...icons };
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.errors.complete();
  }

  writeValue(value: NcAttachmentRef<T>[]) {
    if (value) {
      value = this._initValueCategoies(value);
      this._attachmentRefs.splice(0, this._attachmentRefs.length, ...value);
      this._displayAttachmentRefs.splice(0, this._displayAttachmentRefs.length, ...value);
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

  _select(files: FileList) {
    const attachmentRefs = [];
    for (let i = 0; i < files.length; i++) {
      attachmentRefs.push(this._createAttachmentRef(files[i]));
    }

    this._displayAttachmentRefs.push(...attachmentRefs);

    this._onTouched && this._onTouched();
  }

  _remove(attachmentRef: NcAttachmentRef<T>) {
    if (this.disabled) {
      return;
    }

    this._removeAttachmentRef(attachmentRef);
    this._onChange(this.value);
  }

  private _createAttachmentRef(file: File) {
    const attachmentRef = new NcAttachmentRef<T>(file);

    attachmentRef.subscription = this._uploadHandler
      .upload(this.url, attachmentRef)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(event => this._resolveUploadedResult(attachmentRef, event));

    return attachmentRef;
  }

  private _removeAttachmentRef(attachmentRef: NcAttachmentRef<T>) {
    if (attachmentRef.subscription && !attachmentRef.subscription.closed) {
      attachmentRef.subscription.unsubscribe();
    }

    if (this._attachmentRefs.includes(attachmentRef)) {
      const index = this._attachmentRefs.indexOf(attachmentRef);
      this._attachmentRefs.splice(index, 1);
    }

    if (this._displayAttachmentRefs.includes(attachmentRef)) {
      const displayIndex = this._displayAttachmentRefs.indexOf(attachmentRef);
      this._displayAttachmentRefs.splice(displayIndex, 1);
    }
  }

  private _resolveUploadedResult(attachmentRef: NcAttachmentRef<T>, event: NcUploadEvent<T, any>) {
    if (event instanceof NcUploadResponse) {
      attachmentRef.data = event.data;
      this._attachmentRefs.push(attachmentRef);
    } else {
      attachmentRef.status = NcUploadStatus.ERROR;
      attachmentRef.error = event.error;
      attachmentRef.progress = 100;
      this.errors.next(event.error);
    }
    this._onChange(this.value);
  }

  private _initValueCategoies(attachmentRefs: NcAttachmentRef<T>[]) {
    attachmentRefs.forEach(item => {
      item.category = findCategoryByExtensions(item.name) || 'default';
    });
    return attachmentRefs;
  }
}
