import { Pipe, PipeTransform } from '@angular/core';
import { EventField } from '../EventInfo';
import { Role } from '../Enums';

@Pipe({
  name: 'organizerFieldsFilter'
})
export class OrganizerFieldsFilterPipe implements PipeTransform {

  transform(fields: EventField[]): EventField[] {
    if (!fields) {
      return fields;
    }
    return fields.filter(f => {
      return (f.Access != Role.None) && (Role.Attendee != (f.Access & Role.Attendee));
    });
  }

}
