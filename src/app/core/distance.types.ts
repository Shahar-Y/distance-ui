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
  sex: string;
  fullName: string;
  serviceType: string;
  address: string;
  statusExpiration: string;
};

export type GetPersonsResult = Person & {
  _id: string;
  // CalculatedRoute[] as a string
  routeCalculations: string;
  points: number;
};

export type PersonWithRouteCalculations = Person & {
  _id: string;
  routeCalculations: CalculatedRoute[];
  points: number;
};

export type AddPersonResponse = {
  error: Error | null;
  success: boolean;
  newPerson: GetPersonsResult;
};
