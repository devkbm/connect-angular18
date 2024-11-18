import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadModule, FileUploader } from 'ng2-file-upload';

import { GlobalProperty } from 'src/app/core/global-property';

@Component({
  selector: 'app-article-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule
  ],
  template: `
<!--
<input type="file" ng2FileSelect [uploader]="uploader"/> <button (click)="upload()">업로드</button>
@for (item of uploader.queue; track item) {
  <td><strong>{{ item?.file?.name }}</strong></td>
}
-->

<style>
.my-drop-zone { border: dotted 3px lightgray; }
.nv-file-over { border: dotted 3px red; } /* Default class applied to drop zones on over */
.another-file-over-class { border: dotted 3px green; }

html, body { height: 100%; }
</style>

<div class="container">
  {{this.uploadedFileList() | json}}
  <div class="navbar navbar-default">
    <div class="navbar-header">
      <a class="navbar-brand" href>Angular2 File Upload</a>
    </div>
  </div>

  <div class="row">
    <div class="col-md-3">
      <h3>Select files</h3>
      Multiple <input type="file" ng2FileSelect [uploader]="uploader" multiple/>
      <!--
      <br/>
      Single <input type="file" ng2FileSelect [uploader]="uploader" />
      -->
    </div>

    <div class="col-md-9" style="margin-bottom: 40px">
      <h3>Upload queue</h3>
      <p>Queue length: {{ uploader.queue.length }}</p>

      <table class="table">
        <thead>
          <tr>
            <th width="50%">Name</th>
            <th>Size</th>
            <th>Progress</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          @for (item of uploader.queue; track item) {
          <tr>
            <td><strong>{{ item?.file?.name }}</strong></td>
            @if (uploader.options.isHTML5) {
              <td nowrap>{{ item?.file?.size/1024/1024 | number:'.2' }} MB</td>
              <td>
                <div class="progress" style="margin-bottom: 0;">
                  <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': item.progress + '%' }"></div>
                </div>
              </td>
            }
            <td class="text-center">
              @if (item.isSuccess) {
                <span><i class="glyphicon glyphicon-ok"></i></span>
              }
              @if (item.isCancel) {
                <span><i class="glyphicon glyphicon-ban-circle"></i></span>
              }
              @if (item.isError) {
                <span><i class="glyphicon glyphicon-remove"></i></span>
              }
            </td>
            <td nowrap>
              <button type="button" class="btn btn-success btn-xs"
                (click)="item.upload()" [disabled]="item.isReady || item.isUploading || item.isSuccess">
                <span class="glyphicon glyphicon-upload"></span> Upload
              </button>
              <button type="button" class="btn btn-warning btn-xs"
                (click)="item.cancel()" [disabled]="!item.isUploading">
                <span class="glyphicon glyphicon-ban-circle"></span> Cancel
              </button>
              <button type="button" class="btn btn-danger btn-xs"
                (click)="item.remove()">
                <span class="glyphicon glyphicon-trash"></span> Remove
              </button>
            </td>
          </tr>
          }
        </tbody>
      </table>

      <div>
        <div>
          Queue progress:
          <div class="progress" style="">
            <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': uploader.progress + '%' }"></div>
          </div>
        </div>
        <button type="button" class="btn btn-success btn-s"
          (click)="uploader.uploadAll()" [disabled]="!uploader.getNotUploadedItems().length">
          <span class="glyphicon glyphicon-upload"></span> Upload all
        </button>
        <button type="button" class="btn btn-warning btn-s"
          (click)="uploader.cancelAll()" [disabled]="!uploader.isUploading">
          <span class="glyphicon glyphicon-ban-circle"></span> Cancel all
        </button>
        <button type="button" class="btn btn-danger btn-s"
          (click)="uploader.clearQueue()" [disabled]="!uploader.queue.length">
          <span class="glyphicon glyphicon-trash"></span> Remove all
        </button>
      </div>

    </div>

  </div>

</div>
  `,
  styles: ``
})
export class ArticleFileUploadComponent {

  uploader: FileUploader;
  uploadUrl: string = GlobalProperty.serverUrl + '/api/system/file';

  uploadedFileList = model<{uid: string, name: string, status: string, response: string, url: string}[]>([]);

  constructor() {
    this.uploader = new FileUploader({
      url: this.uploadUrl,
      authToken: sessionStorage.getItem('token')!,
    });

    this.uploader.response.subscribe( res =>
      this.uploadedFileList.set(JSON.parse(res))
    );
  }

  upload() {
    this.uploader.uploadAll();
  }
}
