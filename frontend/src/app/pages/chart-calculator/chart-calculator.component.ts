import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartService, Chart, CalculateChartRequest } from '../../services/chart.service';

@Component({
  selector: 'app-chart-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chart-calculator.component.html',
  styleUrl: './chart-calculator.component.css'
})
export class ChartCalculatorComponent {
  chartForm!: FormGroup;
  isLoading = false;
  apiError: string | null = null;
  chartResult: Chart | null = null;

  constructor(
    private fb: FormBuilder,
    private chartService: ChartService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.chartForm = this.fb.group({
      birthDate: ['', Validators.required],
      birthTime: ['', Validators.required],
      birthLocation: ['', Validators.required],
      notes: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.chartForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.chartForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.apiError = null;

    const formData: any = {
      birthDate: this.chartForm.get('birthDate')?.value,
      birthTime: this.chartForm.get('birthTime')?.value,
      birthLocation: this.chartForm.get('birthLocation')?.value
    };

    this.chartService.calculateChart(formData).subscribe({
      next: (response: any) => {
        // Handle both wrapped and unwrapped responses
        const chartData = response.data ? response.data : response;
        this.chartResult = chartData;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.apiError = error.error?.error || 'Failed to calculate chart. Please try again.';
        console.error('Error calculating chart:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  getPlanetsList(): Array<{ name: string; sign: string; degree: number }> {
    if (!this.chartResult) return [];

    return [
      { name: '☀️ Sun', sign: this.chartResult.planets.sun.sign, degree: this.chartResult.planets.sun.degree },
      { name: '🌙 Moon', sign: this.chartResult.planets.moon.sign, degree: this.chartResult.planets.moon.degree },
      { name: '☿️ Mercury', sign: this.chartResult.planets.mercury.sign, degree: this.chartResult.planets.mercury.degree },
      { name: '♀️ Venus', sign: this.chartResult.planets.venus.sign, degree: this.chartResult.planets.venus.degree },
      { name: '♂️ Mars', sign: this.chartResult.planets.mars.sign, degree: this.chartResult.planets.mars.degree }
    ];
  }

  clearResult(): void {
    this.chartResult = null;
  }

  resetForm(): void {
    this.chartForm.reset();
    this.chartResult = null;
    this.apiError = null;
  }
}
