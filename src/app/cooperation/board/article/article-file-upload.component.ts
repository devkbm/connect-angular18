import { Component } from '@angular/core';

import { FileUploadModule, FileUploader } from 'ng2-file-upload';

import { GlobalProperty } from 'src/app/core/global-property';

@Component({
  selector: 'app-article-file-upload',
  standalone: true,
  imports: [
    FileUploadModule
  ],
  template: `
    <input type="file" ng2FileSelect [uploader]="uploader"/> <button (click)="upload()">업로드</button>
    @for (item of uploader.queue; track item) {
      <td><strong>{{ item?.file?.name }}</strong></td>
    }

  `,
  styles: ``
})
export class ArticleFileUploadComponent {

  uploader: FileUploader;
  uploadUrl: string = GlobalProperty.serverUrl + '/api/system/file';

  fileList: {uid: string, name: string, status: string, response: string, url: string}[] = [];

  constructor() {
    this.uploader = new FileUploader({
      url: this.uploadUrl,
      authToken: sessionStorage.getItem('token')!,
    });

    this.uploader.response.subscribe( res =>
      this.fileList = res
    );
  }

  upload() {
    this.uploader.uploadAll();
  }
}
