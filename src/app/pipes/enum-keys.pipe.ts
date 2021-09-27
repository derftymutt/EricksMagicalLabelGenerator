import { PipeTransform, Pipe } from '@angular/core';

// from https://stackoverflow.com/a/35750252
@Pipe({ name: 'enumKeys' })
export class EnumKeysPipe implements PipeTransform {
  public transform(value): any {
    const keys = [];
    for (const enumMember in value) {
      if (!isNaN(parseInt(enumMember, 10))) {
        keys.push({ key: enumMember, value: value[enumMember] });
      }
    }
    return keys;
  }
}
