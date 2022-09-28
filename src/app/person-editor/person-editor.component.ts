import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DistanceService } from '../core/distance.service';
import { AddPersonResponse, Person } from '../core/distance.types';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-person-editor',
  templateUrl: './person-editor.component.html',
  styleUrls: ['./person-editor.component.css'],
})
export class PersonEditorComponent implements OnInit {
  @Output() newPersonEvent = new EventEmitter<string>();

  serviceTypes = ['HOVA', 'KEVA'];
  personForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    serviceType: new FormControl(
      '',
      // Validators.required,
      Validators.pattern('HOVA|KEVA')
    ),
    address: new FormControl('', Validators.required),
    statusExpiration: new FormControl('', Validators.required),
  });
  constructor(private distanceService: DistanceService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.distanceService
      .addPerson(this.personForm.value as Person)
      .subscribe((data: AddPersonResponse) => {
        this.newPersonEvent.emit(JSON.stringify(data));

        this.personForm.reset();
      });

    // Use EventEmitter with form value to send data to parent component as a string
  }
}
