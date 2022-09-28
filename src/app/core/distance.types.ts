import { DirectionsRoute } from '@googlemaps/google-maps-services-js';

// The type explaining the step in the route
export type StepExplanation = {
  lineName: string;
  routeShortName: string;
  stepTotalTimeMins: number;
  avgWaitingTimeRealMins: number;
  stepTransitDurationMins: number;
};

// The route object that will be returned
export type CalculatedRoute = {
  route: DirectionsRoute;
  totalTime: number;
  explanation: StepExplanation[];
};

export type Person = {
  firstName: string;
  lastName: string;
  serviceType: string;
  address: string;
  statusExpiration: string;
};

export type PersonWithRouteCalculation = Person & {
  _id: string;
  routeCalculation: string;
};

export type AddPersonResponse = {
  error: Error | null;
  success: boolean;
  newPerson: PersonWithRouteCalculation;
};
