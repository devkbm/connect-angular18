import { Self, Optional, Component, TemplateRef, HostBinding, viewChild, effect, input, model } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormModule } from 'ng-zorro-antd/form';

import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';

//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

//import '@ckeditor/ckeditor5-build-classic/build/translations/ko';
import Editor from 'ckeditor5/build/ckeditor';

import { MyUploadAdapter } from './my-upload-adapter';

// https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/angular.html
// https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/installing-plugins.html
// https://ckeditor.com/ckeditor-5/online-builder/

@Component({
  selector: 'app-nz-input-ckeditor',
  standalone: true,
  imports: [FormsModule, NzFormModule, CKEditorModule],
  template: `
   <nz-form-item>
      <nz-form-label [nzFor]="itemId()" [nzRequired]="required()">
        <ng-content></ng-content>
      </nz-form-label>
      <nz-form-control nzHasFeedback [nzErrorTip]="nzErrorTip()" #control>
        <!-- tagName="textarea" -->
        <ckeditor #ckEditor
          [editor]="Editor"
          [config]="editorConfig"
          [disabled]="_disabled"
          [ngModel]="_value()"
          (change)="textChange($event)"
          (blur)="onTouched()"
          (ready)="onReady($event)">
        </ckeditor>
      </nz-form-control>
    </nz-form-item>
  `,
  styles: [`
    :host /*::ng-deep*/ .ck-editor__editable {
      color: black;
      height: var(--height);
    }
  `]
})
export class NzInputCkeditorComponent implements ControlValueAccessor {

  control = viewChild.required(NzFormControlComponent);
  ckEditor = viewChild.required(CKEditorComponent);

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');

  @HostBinding("style.--height")
  height = input<string>('100px');

  nzErrorTip = input<string | TemplateRef<{$implicit: AbstractControl | NgModel;}>>();

  _disabled = false;
  _value = model();

  onChange!: (value: any) => void;
  onTouched!: () => void;

  Editor = Editor;
  editorConfig;

  constructor(@Self()  @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      if (this.control()) {
        this.control().nzValidateStatus = this.ngControl.control as AbstractControl;
      }
    });

    this.editorConfig = {
      language: 'ko',
      toolbar: [
        'heading', '|',
        'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor', '|',
        'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
        'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify', '|',
        'bulletedList', 'numberedList', 'todoList', '|',
        '-', // break point
        'uploadImage', 'insertTable', '|',
        'outdent', 'indent', '|',
        'blockQuote', 'codeBlock', '|',
        'link', '|',
        'undo', 'redo'
      ],
      image: {
        toolbar: [
          'imageStyle:inline',
          'imageStyle:block',
          'imageStyle:side',
          '|',
          'toggleImageCaption',
          'imageTextAlternative'
        ]
      },
      extraPlugins: [
        function (editor: any) {
          editor.plugins.get('FileRepository').createUploadAdapter = (loader :any) => {
            return new MyUploadAdapter(loader);
          };
        }
      ]
    };

  }

  onReady(editor: any): void {
    //this.MyCustomUploadAdapterPlugin(editor);
    //editor.extraPlugins = [this.MyCustomUploadAdapterPlugin(editor)];
  }

  MyCustomUploadAdapterPlugin(editor: any ): any {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader: any ) => {
      return new MyUploadAdapter( loader );
    }
  }

  logging(params: any) {
    console.log(params);
  }

  writeValue(obj: any): void {
    this._value.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  //textChange( {editor}: ChangeEvent): void {
  textChange( {editor}: any): void {

    this._value.set(editor.getData());
    this.onChange(this._value());
  }

}
