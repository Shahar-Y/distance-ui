import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DistanceService } from '../core/distance.service';
import {
  AddPersonResponse,
  Person,
  PersonWithRouteCalculations,
} from '../core/distance.types';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-person-editor',
  templateUrl: './person-editor.component.html',
  styleUrls: ['./person-editor.component.css'],
})
export class PersonEditorComponent implements OnInit {
  @Output() newPersonEvent = new EventEmitter<string>();

  serviceTypes = ['חובה', 'קבע'];
  sexes = ['MALE', 'FEMALE'];
  personForm = new FormGroup({
    sex: new FormControl(
      '',
      // Validators.required,
      Validators.pattern('MALE|FEMALE')
    ),
    fullName: new FormControl('', Validators.required),
    serviceType: new FormControl(
      '',
      // Validators.required,
      Validators.pattern('חובה|קבע')
    ),
    address: new FormControl('', Validators.required),
    statusExpiration: new FormControl('', Validators.required),
  });
  constructor(private distanceService: DistanceService) {}

  ngOnInit(): void {}

  /**
   * Adds a new person to the database.
   * After the person is added, the person is emitted to the parent component (AppComponent).
   */
  onSubmit() {
    this.distanceService
      .addPerson(this.personForm.value as Person)
      .subscribe((addPersonResponse: AddPersonResponse) => {
        if (addPersonResponse.success === false) {
          console.log("Couldn't add person");
          alert("Couldn't add person. Check the address and try again");
          return;
        }
        const handledPerson: PersonWithRouteCalculations =
          this.distanceService.handlePersons([addPersonResponse.newPerson])[0];
        this.newPersonEvent.emit(JSON.stringify(handledPerson));

        this.personForm.reset();
      });

    // Use EventEmitter with form value to send data to parent component as a string
  }
}
