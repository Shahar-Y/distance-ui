import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import {
  AddPersonResponse,
  PersonWithRouteCalculations,
} from './core/distance.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'distance-ui';

  eventsSubject: Subject<PersonWithRouteCalculations> =
    new Subject<PersonWithRouteCalculations>();

  /**
   * Triggered from person-editor when a new person is added to the database.
   * Passes the new person to the simple-table component.
   * @param addPersonResponseString - The new person as a string.
   */
  addPerson(addPersonResponseString: string) {
    const addPersonResponse: PersonWithRouteCalculations = JSON.parse(
      addPersonResponseString
    );
    this.eventsSubject.next(addPersonResponse);
  }
}
