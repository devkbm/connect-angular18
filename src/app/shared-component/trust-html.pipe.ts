import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'trustHtml',
  standalone: true
})
export class TrustHtmlPipe implements PipeTransform {

  sanitizer = inject(DomSanitizer);

  transform(value: string | undefined, ...args: unknown[]) {
    return this.sanitizer.bypassSecurityTrustHtml(value!);
  }

}
