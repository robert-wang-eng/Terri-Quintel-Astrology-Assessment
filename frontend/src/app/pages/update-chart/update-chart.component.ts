import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartService, Chart, UpdateChartRequest } from '../../services/chart.service';

@Component({
  selector: 'app-update-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-chart.component.html',
  styleUrl: './update-chart.component.css'
})
export class UpdateChartComponent implements OnInit {
  chart: Chart | null = null;
  chartId: string = '';
  
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  successMessage: string | null = null;
  hasAstrologyChanges = false;

  formData: UpdateChartRequest = {
    name: '',
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    notes: '',
    isPublic: false
  };

  originalFormData: UpdateChartRequest = {};

  constructor(
    private chartService: ChartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.chartId = params['id'];
      if (this.chartId) {
        this.loadChart();
      }
    });
  }

  /**
   * Load chart by ID
   */
  loadChart(): void {
    this.isLoading = true;
    this.error = null;

    this.chartService.getChartById(this.chartId).subscribe({
      next: (response: any) => {
        const data = response.data ? response.data : response;
        this.chart = data;
        this.initializeForm();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading chart:', err);
        this.error = err.error?.error || 'Failed to load chart. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Initialize form with chart data
   */
  private initializeForm(): void {
    if (this.chart) {
      this.formData = {
        name: this.chart.name || '',
        birthDate: this.chart.birthDate ? this.chart.birthDate.split('T')[0] : '',
        birthTime: this.chart.birthTime || '',
        birthLocation: this.chart.birthLocation || '',
        notes: (this.chart as any).notes || '',
        isPublic: (this.chart as any).isPublic || false
      };
      // Save original values for reset
      this.originalFormData = { ...this.formData };
    }
  }

  /**
   * Update chart
   */
  updateChart(): void {
    if (!this.chartId) {
      this.error = 'Chart ID is missing';
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.successMessage = null;

    this.chartService.updateChart(this.chartId, this.formData).subscribe({
      next: (response: any) => {
        const data = response.data ? response.data : response;
        this.chart = data;
        this.successMessage = 'Chart updated successfully!';
        this.isSubmitting = false;
        
        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/task1']);
        }, 2000);
      },
      error: (err: any) => {
        console.error('Error updating chart:', err);
        this.error = err.error?.error || 'Failed to update chart. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Reset form to original values
   */
  resetForm(): void {
    this.formData = { ...this.originalFormData };
    this.hasAstrologyChanges = false;
    this.successMessage = null;
  }

  /**
   * Check if birth information has changed (triggers astrological recalculation)
   */
  onBirthInfoChange(): void {
    this.hasAstrologyChanges = 
      this.formData.birthDate !== this.originalFormData.birthDate ||
      this.formData.birthTime !== this.originalFormData.birthTime ||
      this.formData.birthLocation !== this.originalFormData.birthLocation;
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * Navigate back to task1
   */
  goBack(): void {
    this.router.navigate(['/task1']);
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
