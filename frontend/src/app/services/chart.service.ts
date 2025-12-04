import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

export interface Planet {
    sign: string;
    degree: number;
}

export interface Chart {
    id: string;
    name: string;
    birthDate: string;
    birthTime: string;
    birthLocation: string;
    sunSign: string;
    moonSign: string;
    risingSign: string;
    planets: {
        sun: Planet;
        moon: Planet;
        mercury: Planet;
        venus: Planet;
        mars: Planet;
    };
}

export interface CalculateChartRequest {
    birthDate: string;
    birthTime: string;
    birthLocation: string;
    notes?: string;
}

export interface UpdateChartRequest {
    name?: string;
    birthDate?: string;
    birthTime?: string;
    birthLocation?: string;
    notes?: string;
    isPublic?: boolean;
}

export interface ChartFilters {
    page?: number;
    limit?: number;
    sunSign?: string;
    moonSign?: string;
    risingSign?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isPublic?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    request<T>(
        method: 'get' | 'post' | 'put' | 'delete',
        endpoint: string,
        body?: any,
        timeoutMs: number = 5000
    ): Observable<T> {
        const url = `${this.apiUrl}/${endpoint}`;
        const ms = timeoutMs;
        switch (method) {
            case 'get':
                return this.http.get<T>(url).pipe(timeout(ms));
            case 'post':
                return this.http.post<T>(url, body).pipe(timeout(ms));
            case 'put':
                return this.http.put<T>(url, body).pipe(timeout(ms));
            case 'delete':
                return this.http.delete<T>(url).pipe(timeout(ms));
            default:
                return this.http.get<T>(url).pipe(timeout(ms));
        }
    }

    getAllCharts(): Observable<Chart[]> {
        return this.request<Chart[]>('get', 'charts');
    }

    /**
     * Fetch charts with pagination and filtering
     * @param filters - Object containing page, limit, and filter criteria
     * @returns Observable with paginated chart data
     */
    getAllChartsWithPagination(page: number = 1, limit: number = 10, sunSign: string = ''): Observable<any> {
        let url = `charts?page=${page}&limit=${limit}`;
        if (sunSign) {
            url += `&sunSign=${sunSign}`;
        }
        return this.request<any>('get', url);
    }

    /**
     * Fetch charts with advanced filtering options
     * @param filters - Advanced filter criteria including sign filters, sorting, etc.
     * @returns Observable with filtered and paginated chart data
     */
    getChartsWithFilters(filters: ChartFilters = {}): Observable<any> {
        const {
            page = 1,
            limit = 10,
            sunSign = '',
            sortBy = 'createdAt',
            sortOrder = 'desc',
            isPublic
        } = filters;

        let url = `charts?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        
        if (sunSign) url += `&sunSign=${sunSign}`;
        if (isPublic !== undefined) url += `&isPublic=${isPublic}`;

        return this.request<any>('get', url);
    }

    getChartById(id: string | number): Observable<Chart> {
        return this.request<Chart>('get', `charts/${id}`);
    }

    calculateChart(request: CalculateChartRequest): Observable<Chart> {
        return this.request<Chart>('post', 'charts/calculate', request);
    }

    updateChart(id: string, request: UpdateChartRequest): Observable<Chart> {
        return this.request<Chart>('put', `charts/${id}`, request);
    }

    deleteChart(id: string): Observable<any> {
        return this.request<any>('delete', `charts/${id}`);
    }

    initializeProject(): Observable<any> {
        return this.request<any>('get', 'init');
    }
}

