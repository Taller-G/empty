import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
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

  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }

  refreshWeatherData(): void {
    // Simulate data refresh
    console.log('Refreshing weather data...');
    // Here you would typically call a weather service
  }
}
