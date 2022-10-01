import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DistanceService } from '../core/distance.service';
import {
  GetPersonsResult,
  PersonWithRouteCalculations,
} from '../core/distance.types';
import { Input, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.css'],
})
export class SimpleTableComponent implements OnInit {
  private eventsSubscription: Subscription = new Subscription();

  defaultFilterPredicate: (data: any, filter: string) => boolean = (
    data: any,
    filter: string
  ) => {
    return true;
  };
  searchText: string = '';
  freeFilter: string = '';

  positionColumn = ['position'];
  autoDisplayedColumns: string[] = [
    'sex',
    'fullName',
    'serviceType',
    'address',
    'statusExpiration',
    'points',
  ];

  additionalColumns: string[] = ['delete'];
  allColumns: string[] = this.positionColumn.concat(
    this.autoDisplayedColumns.concat(this.additionalColumns)
  );

  dataSource: MatTableDataSource<PersonWithRouteCalculations> =
    new MatTableDataSource();

  @Input()
  events!: Observable<PersonWithRouteCalculations>;

  constructor(private distanceService: DistanceService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.filterSex(this.searchText);

    if (this.freeFilter) {
      this.generalFilter(this.freeFilter);
    }
  }

  ngAfterViewInit() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.distanceService
      .getPersons()
      .subscribe((persons: GetPersonsResult[]) => {
        this.dataSource = new MatTableDataSource(
          this.distanceService.handlePersons(persons)
        );
        this.calculatePoints();
        this.sortDataByPoints();
        console.log(this.dataSource.data);
      });

    // Subscribe to the events observable.
    // Triggered when a new person is added from the person-editor component,
    // via the newPersonEvent emitter in the app.component.
    this.eventsSubscription = this.events.subscribe(
      (person: PersonWithRouteCalculations) => this.addRow(person)
    );

    this.defaultFilterPredicate = this.dataSource.filterPredicate;
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  /**
   * Adds a new row to the table
   * @param person - The person to add.
   */
  addRow(person: PersonWithRouteCalculations) {
    this.dataSource.data.unshift(person);
    this.calculatePoints();
    this.dataSource._updateChangeSubscription();
  }

  /**
   * Deletes a row from the table and from the DB.
   * @param person - The person to delete.
   */
  deleteRow(person: PersonWithRouteCalculations) {
    this.dataSource.data = this.dataSource.data.filter(
      (e) => e._id !== person._id
    );
    this.distanceService.removePerson(person._id).subscribe((res) => {});
    alert(person.fullName + ' deleted');
    this.calculatePoints();
  }

  /**
   * Calculates the points for the table.
   */
  calculatePoints() {
    this.dataSource.data.map((person) => {
      const points =
        (person.routeCalculations[0]?.totalTime +
          person.routeCalculations[1]?.totalTime) /
        2;
      person.points = Math.round(points * 100) / 100;
    });
  }

  /**
   * Sorts the table by points.
   */
  sortDataByPoints() {
    this.dataSource.data.sort((a, b) => b.points - a.points);
    this.dataSource._updateChangeSubscription();
  }

  filterSex(filterValue: string) {
    this.dataSource.filterPredicate = function (record, searchedSex) {
      if (!searchedSex) return true;
      return record.sex === searchedSex;
    };
    this.dataSource.filter = filterValue;
  }

  generalFilter(filterValue: string) {
    this.dataSource.filterPredicate = this.defaultFilterPredicate;
    this.dataSource.filter = filterValue;
  }

  // Returns the expiration status of the person.
  expirationStatus(person: PersonWithRouteCalculations): Expiration {
    const today = new Date();
    const expiration = new Date(person.statusExpiration.toString());
    // if longer than two months, return Expiration.LONG
    if (expiration.getTime() - today.getTime() > 2 * 30 * 24 * 60 * 60 * 1000) {
      return Expiration.LONG;
    }
    // Otherwise, if not expired, return Expiration.SHORT
    else if (expiration.getTime() - today.getTime() > 0) {
      return Expiration.SHORT;
    }
    // Otherwise, return Expiration.EXPIRED
    return Expiration.EXPIRED;
  }

  // Returns the total distance of the person.
  getPersonDistance(person: PersonWithRouteCalculations): number {
    return person.routeCalculations[0].route.legs[0].distance.value / 1000;
  }

  // Returns true if the person is eligible for ANA.
  getPersonEligible(person: PersonWithRouteCalculations): boolean {
    return this.getPersonDistance(person) > 110 ? true : false;
  }

  getRowTooltip(person: PersonWithRouteCalculations): string {
    return `מרחק: ${this.getPersonDistance(person)} ק"מ, \n ${
      this.getPersonEligible(person)
        ? '** זכאי לאכסנייה **'
        : 'לא זכאי לאכסנייה'
    }. זמן תוקף של הזכאות: ${this.translateExpirationStatus(
      this.expirationStatus(person)
    )}`;
  }

  translateExpirationStatus(expiration: Expiration): string {
    switch (expiration) {
      case Expiration.SHORT:
        return 'קרוב';
      case Expiration.LONG:
        return 'רחוק';
      case Expiration.EXPIRED:
        return 'לא זכאי';
    }
  }
}

enum Expiration {
  LONG = 'LONG',
  SHORT = 'SHORT',
  EXPIRED = 'EXPIRED',
}
