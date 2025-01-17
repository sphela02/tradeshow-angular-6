import { Pipe, PipeTransform } from '@angular/core';
import { EventField } from '../EventInfo';
import { Role } from '../Enums';

@Pipe({
  name: 'attendeeFieldsFilter'
})
export class AttendeeFieldsFilterPipe implements PipeTransform {

  transform(fields: EventField[]): EventField[] {
    if (!fields) {
      return fields;
    }

    var ffields = fields.filter(f => Role.Attendee == (f.Access & Role.Attendee));
    return fields.filter(f => Role.Attendee == (f.Access & Role.Attendee))
  }

}
