import {Pipe, PipeTransform} from '@angular/core';

/**
 * Generated class for the NumberFormatterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'numberFormatter',
})
export class NumberFormatterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args: any[]): string {
    const valueString = value.toString();
    const options = {
      minimumSignificantDigits: 2,
      maximumSignificantDigits: 2
    }

    args.forEach(arg => {
      if (arg === 'price') {
        options.maximumSignificantDigits = 3;
      }
    });

    return new Intl.NumberFormat('de-DE', options).format(value);
  }
}
