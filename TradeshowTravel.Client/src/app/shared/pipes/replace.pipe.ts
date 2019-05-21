import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: string, search: string, replacement: string): string {
    if (value) {
      value = value.split(search).join(replacement);
    }
    return value;
  }

}
