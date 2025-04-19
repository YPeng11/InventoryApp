import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem, Category, StockStatus } from '../models/item';

const API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(API_URL);
  }

  getItemByName(name: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${API_URL}/name/${encodeURIComponent(name)}`);
  }

  addItem(item: InventoryItem): Observable<any> {
    return this.http.post(API_URL, item, { headers: this.headers });
  }

  updateItem(name: string, item: InventoryItem): Observable<any> {
    return this.http.put(`${API_URL}/name/${encodeURIComponent(name)}`, item, { headers: this.headers });
  }

  deleteItem(name: string): Observable<any> {
    return this.http.delete(`${API_URL}/name/${encodeURIComponent(name)}`);
  }
}