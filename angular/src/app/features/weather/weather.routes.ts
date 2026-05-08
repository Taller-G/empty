import { Routes } from '@angular/router';

export const weatherRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/weather/weather.component').then((m) => m.WeatherComponent),
  },
];
