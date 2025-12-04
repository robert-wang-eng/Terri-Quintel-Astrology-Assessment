import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chart, ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.css'
})
export class ChartCardComponent {
  @Input() chart!: Chart;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  constructor(private router: Router, private chartService: ChartService) {}

  onEdit(): void {
    this.edit.emit(this.chart.id);
  }

  onDelete(): void {
    this.delete.emit(this.chart.id);
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      });
    } catch (error) {
      return dateString;
    }
  }

  getPlanetsList(chart: Chart): Array<{ name: string; sign: string; degree: number }> {
    if (!chart.planets) {
      return [];
    }
    
    let planetNames = Object.keys(chart.planets);
    return planetNames.map((name: string) => {
      const planet = (chart.planets as any)[name];
      return {
        name: name[0].toUpperCase() + name.slice(1),
        sign: planet.sign,
        degree: planet.degree
      };
    });
  }
}
