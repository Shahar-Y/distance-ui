import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DistanceService } from '../core/distance.service';
import { PersonWithRouteCalculation } from '../core/distance.types';
import { Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.css'],
})
export class SimpleTableComponent implements OnInit {
  private eventsSubscription: Subscription = new Subscription();

  autoDisplayedColumns: string[] = [
    '_id',
    'firstName',
    'lastName',
    'serviceType',
    'address',
    'statusExpiration',
  ];

  additionalColumns: string[] = ['delete'];
  allColumns: string[] = this.autoDisplayedColumns.concat(
    this.additionalColumns
  );

  dataSource: MatTableDataSource<PersonWithRouteCalculation> =
    new MatTableDataSource();

  @Input()
  events!: Observable<PersonWithRouteCalculation>;

  constructor(private distanceService: DistanceService) {}

  ngAfterViewInit() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.distanceService
      .getPersons()
      .subscribe((persons: PersonWithRouteCalculation[]) => {
        this.dataSource = new MatTableDataSource(persons);
      });

    this.eventsSubscription = this.events.subscribe((data) =>
      this.addRow(data)
    );
  }
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  addRow(person: PersonWithRouteCalculation) {
    this.dataSource.data.unshift(person);
    this.dataSource._updateChangeSubscription();
  }

  deleteRow(person: PersonWithRouteCalculation) {
    this.dataSource.data = this.dataSource.data.filter(
      (e) => e._id !== person._id
    );
    this.distanceService.removePerson(person._id).subscribe((res) => {});
    alert(person.firstName + ' deleted');
  }
}
