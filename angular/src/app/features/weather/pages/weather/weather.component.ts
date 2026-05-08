import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  temperature: number = 25;  // Example data, can be dynamic
  description: string = 'Sunny'; // Example data, can be fetched
  humidity: number = 60; // Example data, can be fetched

  constructor() { }

  ngOnInit(): void {
    // Initialize or fetch data here
  }
}
