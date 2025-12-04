import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChartService, Chart, ChartFilters } from '../../services/chart.service';
import { ZODIAC_SIGNS, PAGE_SIZE_OPTIONS } from '../../constants/zodiac.constants';
import { ChartCardComponent } from '../../components/chart-card/chart-card.component';

@Component({
  selector: 'app-chart-browser',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartCardComponent],
  templateUrl: './chart-browser.component.html',
  styleUrl: './chart-browser.component.css'
})
export class ChartBrowserComponent implements OnInit {
  charts: Chart[] = [];
  totalCharts: number = 0;
  
  isLoading = false;
  error: string | null = null;
  
  filters: ChartFilters = {
    page: 1,
    limit: 10,
    sunSign: '',
    moonSign: '',
    risingSign: '',
    sortBy: 'name',
    sortOrder: 'asc'
  };

  zodiacSigns = ZODIAC_SIGNS;
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  get currentPage(): number {
    return this.filters.page || 1;
  }

  set currentPage(value: number) {
    if (this.filters) {
      this.filters.page = value;
    }
  }

  get totalPages(): number {
    if (!this.filters.limit) return 1;
    return Math.ceil(this.totalCharts / this.filters.limit);
  }

  constructor(private chartService: ChartService, private router: Router) {}

  ngOnInit() {
    this.loadCharts();
  }

  loadCharts(): void {
    this.isLoading = true;
    this.error = null;

    this.chartService.getChartsWithFilters(this.filters).subscribe({
      next: (response: any) => {
        this.handleChartsResponse(response);
      },
      error: (err: any) => {
        this.handleError(err);
      }
    });
  }

  private handleChartsResponse(response: any): void {
    try {
      const data = response.data ? response : { data: response };
      
      this.charts = data.data || [];
      this.totalCharts = data.total || 0;
      
      console.log(`Loaded ${this.charts.length} charts. Total: ${this.totalCharts}`);
      this.isLoading = false;
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: any): void {
    console.error('Error loading charts:', err);
    this.error = err.error?.error || 'Failed to load charts. Please try again.';
    this.isLoading = false;
  }

  onFilterChange(): void {
    this.currentPage = 1; // Reset to first page
    this.loadCharts();
  }

  resetFilters(): void {
    this.filters = {
      page: 1,
      limit: 10,
      sunSign: '',
      moonSign: '',
      risingSign: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    this.loadCharts();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCharts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCharts();
    }
  }

  deleteChart(chartId: string): void {
    if (!confirm('Are you sure you want to delete this chart?')) {
      return;
    }

    this.chartService.deleteChart(chartId).subscribe({
      next: () => {
        this.loadCharts();
      },
      error: (err: any) => {
        this.error = err.error?.error || 'Failed to delete chart. Please try again.';
        console.error('Error deleting chart:', err);
      }
    });
  }
  
  editChart(chartId: string): void {
    this.router.navigate(['/update-chart', chartId]);
  }

  retryLoadCharts(): void {
    this.loadCharts();
  }
}

