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

    fields.forEach(function (x, i) {
      console.log("Field " + i + " : Lable: " + x.Label + " : Access: " + x.Access);
    })

    var ffields = fields.filter(f => Role.Attendee == (f.Access & Role.Attendee));
    
    console.log("Role: " + Role.Attendee);
    console.log(ffields);
    return fields.filter(f => Role.Attendee == (f.Access & Role.Attendee))
  }

}
