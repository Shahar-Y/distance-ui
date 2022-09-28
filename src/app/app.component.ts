import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import {
  AddPersonResponse,
  PersonWithRouteCalculation,
} from './core/distance.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'distance-ui';

  eventsSubject: Subject<PersonWithRouteCalculation> =
    new Subject<PersonWithRouteCalculation>();

  addPerson(addPersonResponseString: string) {
    const addPersonResponse: AddPersonResponse = JSON.parse(
      addPersonResponseString
    );

    if (addPersonResponse.success === false) {
    } else {
      this.eventsSubject.next(addPersonResponse.newPerson);
    }
  }
}
