import { Pipe, PipeTransform } from '@angular/core';
import { EventUser } from '../EventInfo';
import { Role } from '../Enums';

@Pipe({
  name: 'eventUserFilter'
})
export class EventUserFilterPipe implements PipeTransform {

  transform(users: EventUser[], role: Role): EventUser[] {
    if (!users) {
      return users;
    }
    return users.filter(u => {
      return role == (u.Role & role);
    });
  }

}
