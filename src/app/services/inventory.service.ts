import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, retry, delay } from 'rxjs/operators';
import { InventoryItem, Category, StockStatus } from '../models/item';

const API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {}

  // 获取所有项目（带重试机制）
  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(API_URL, { headers: this.headers }).pipe(
      retry(2), // 失败时自动重试2次
      tap(_ => console.log('成功获取项目列表')),
      catchError(this.handleError<InventoryItem[]>('getAllItems', []))
    );
  }

  // 按名称获取项目
  getItemByName(name: string): Observable<InventoryItem> {
    const url = `${API_URL}/name/${encodeURIComponent(name)}`;
    return this.http.get<InventoryItem>(url, { headers: this.headers }).pipe(
      tap(_ => console.log(`获取项目: ${name}`)),
      catchError(this.handleError<InventoryItem>(`getItemByName name=${name}`))
    );
  }

  // 添加新项目（带数据格式化）
  addItem(item: InventoryItem): Observable<any> {
    const formattedItem = this.formatItemData(item);
    console.log('添加项目请求数据:', formattedItem);

    return this.http.post(API_URL, formattedItem, { headers: this.headers }).pipe(
      tap((response) => console.log('添加成功:', response)),
      catchError(this.handleError('addItem'))
    );
  }

  // 更新项目
  updateItem(name: string, item: InventoryItem): Observable<any> {
    const formattedItem = this.formatItemData(item);
    const url = `${API_URL}/name/${encodeURIComponent(name)}`;
    console.log('更新项目请求:', url, formattedItem);

    return this.http.put(url, formattedItem, { headers: this.headers }).pipe(
      tap(_ => console.log(`更新项目: ${name}`)),
      catchError(this.handleError('updateItem'))
    );
  }

  // 删除项目
  deleteItem(name: string): Observable<any> {
    const url = `${API_URL}/name/${encodeURIComponent(name)}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      tap(_ => console.log(`删除项目: ${name}`)),
      catchError(this.handleError('deleteItem'))
    );
  }

  // 格式化数据以匹配API要求
  private formatItemData(item: InventoryItem): any {
    return {
      item_name: item.itemName, // 注意字段名匹配
      category: item.category,
      quantity: Number(item.quantity),
      price: Number(item.price),
      supplier_name: item.supplierName,
      stock_status: item.stockStatus,
      featured: item.featured ? 1 : 0,
      special_notes: item.specialNotes || null
    };
  }

  // 统一错误处理
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} 失败:`, error);

      // 详细解析错误信息
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // 客户端错误
        errorMessage = `客户端错误: ${error.error.message}`;
      } else {
        // 服务器端错误
        errorMessage = this.parseServerError(error);
      }

      // 返回友好的错误信息
      return throwError(() => new Error(errorMessage));
    };
  }

  // 解析服务器错误详情
  private parseServerError(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return '请求参数无效: ' + (error.error?.message || JSON.stringify(error.error));
      case 401:
        return '认证失败，请重新登录';
      case 403:
        return '没有操作权限';
      case 404:
        return '请求的资源不存在';
      case 500:
        return `服务器内部错误 (${error.status}): ${this.getServerErrorDetail(error)}`;
      default:
        return `未知错误 (${error.status}): ${error.message}`;
    }
  }

  // 获取服务器错误详情
  private getServerErrorDetail(error: HttpErrorResponse): string {
    try {
      if (error.error instanceof ProgressEvent) {
        return '网络连接错误';
      }
      return error.error?.message || 
             error.error?.error || 
             error.message || 
             '未知服务器错误';
    } catch (e) {
      return '无法解析错误详情';
    }
  }

  // 开发环境模拟API（可选）
  private simulateApiResponse(item: any): Observable<any> {
    console.warn('使用模拟API响应');
    return of({
      success: true,
      item_id: Math.floor(Math.random() * 1000),
      item: item
    }).pipe(delay(300));
  }
}