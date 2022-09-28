import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AddPersonResponse,
  CalculatedRoute,
  Person,
  PersonWithRouteCalculation,
} from './distance.types';

@Injectable({
  providedIn: 'root',
})
export class DistanceService {
  serviceUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  /**
   * Get the route calculation from the origin to the destination.
   * @param origin - the origin of the route.
   * @param destination - the destination of the route.
   * @param arrival_time - the arrival time of the route.
   * @param departure_time - the departure time of the route.
   * If both arrival_time and departure_time are specified, the arrival_time is neglected.
   * @returns an observable of the CalculatedRoute.
   */
  getDistance(
    origin: string,
    destination: string,
    arrival_time: Date | number,
    departure_time?: Date | number
  ): Observable<CalculatedRoute[]> {
    const params = new HttpParams()
      .set('origin', origin)
      .set('destination', destination)
      .set('arrival_time', arrival_time.toString())
      .set('departure_time', departure_time?.toString() || '');

    const response = this.httpClient.get<CalculatedRoute[]>(
      this.serviceUrl + '/api/calculator',
      { params }
    );
    return response;
  }

  /**
   * Add a person to the database.
   * @param person - the person to add.
   * @returns an observable of the added person.
   */
  addPerson(person: Person): Observable<AddPersonResponse> {
    return this.httpClient.post<AddPersonResponse>(
      this.serviceUrl + '/api/person',
      person
    );
  }

  /**
   * Remove a person from the database.
   * @param id - the id of the person to remove.
   * @returns an observable of the removed person.
   */
  removePerson(id: string): Observable<PersonWithRouteCalculation> {
    return this.httpClient.delete<PersonWithRouteCalculation>(
      this.serviceUrl + '/api/person/' + id
    );
  }

  /**
   * Get all persons from the database.
   * @returns an observable of the persons.
   */
  getPersons(): Observable<PersonWithRouteCalculation[]> {
    return this.httpClient.get<PersonWithRouteCalculation[]>(
      this.serviceUrl + '/api/person'
    );
  }
}
