import { fromEvent } from 'rxjs';

import { BooleanInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import {
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NcFileError, NcFileSizeError, NcFileTypeError } from './file-select-errors';

@Directive({
  standalone: false,
  selector: '[ncFileSelect]',
  host: {
    '(click)': 'trigger($event)',
  },
})
export class NcFileSelect implements OnInit, OnChanges {
  private _destroyRef = inject(DestroyRef);

  private _accept = '*';

  @Input()
  get accept() {
    return this._accept;
  }
  set accept(value: string | Array<string>) {
    if (typeof value === 'string') {
      this._accept = value.replace(' ', '');
    } else {
      this._accept = value.join(',');
    }
  }

  private _limitSize = Number.MAX_VALUE;

  @Input()
  get limitSize() {
    return this._limitSize;
  }
  set limitSize(value: number) {
    this._limitSize = coerceNumberProperty(value, 5);
  }

  private _multiple = false;

  @Input()
  get multiple() {
    return this._multiple;
  }
  set multiple(value: BooleanInput) {
    this._multiple = coerceBooleanProperty(value);
  }

  private _disabled = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }

  @Output() select = new EventEmitter<FileList>();

  @Output() errors = new EventEmitter<NcFileError[]>();

  private _input!: HTMLInputElement;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['accept'] || changes['maxSize'] || changes['multiple'];
    if (change && !change.firstChange) {
      this._updateProperty();
    }
  }

  ngOnInit() {
    this._input = this._renderer.createElement('input');
    this._renderer.setStyle(this._input, 'visibility', 'hidden');
    this._renderer.setStyle(this._input, 'width', 0);
    this._renderer.setStyle(this._input, 'height', 0);
    this._renderer.setStyle(this._input, 'margin', 0);
    this._renderer.setProperty(this._input, 'type', 'file');
    this._updateProperty();

    fromEvent(this._input, 'change')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(event => this._change(event));
  }

  trigger(event: Event) {
    if (!this.disabled) {
      this._input.click();
    }
    event.preventDefault();
  }

  private _updateProperty() {
    this._renderer.setProperty(this._input, 'accept', this._accept);
    this._renderer.setProperty(this._input, 'disabled', this.disabled);
    this._renderer.setProperty(this._input, 'multiple', this.multiple ? 'multiple' : null);
  }

  private _change(_: Event) {
    const errors: NcFileError[] = [];
    const dataTransfer = new DataTransfer();

    for (let index = 0; index < (this._input.files || []).length; index++) {
      const file = this._input.files!.item(index) as File;

      let valid = true;

      if (!(valid = this._fileSizeValid(file))) {
        errors.push(new NcFileSizeError(file, this.limitSize));
      } else if (!(valid = this._fileTypeValid(file))) {
        errors.push(new NcFileTypeError(file, file.type));
      }

      if (valid) {
        dataTransfer.items.add(file);
      }
    }

    if (errors.length > 0) {
      this.errors.next(errors);
    }
    if (dataTransfer.items.length > 0) {
      this.select.next(dataTransfer.files);
    }

    this._input.value = '';
  }

  private _fileTypeValid(file: File) {
    return this.accept.indexOf(file.type) > -1 || this.accept.indexOf('*') > -1;
  }

  private _fileSizeValid(file: File) {
    return file.size <= this.limitSize * 1024 * 1024;
  }
}
