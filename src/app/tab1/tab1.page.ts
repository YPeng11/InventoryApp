import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonFab, 
  IonFabButton,
  IonIcon,
  IonButtons,
  IonButton,
  IonItemSliding,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonList,
  IonSearchbar,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonContent,
  IonLabel,
  IonText,
  IonBackButton,
  IonAlert,
  IonListHeader
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, Category, StockStatus } from '../models/item';
import { HttpClientModule } from '@angular/common/http'; // 新增

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HttpClientModule, // 新增
    // Ionic 组件
    IonFab,
    IonFabButton,
    IonIcon,
    IonButtons,
    IonButton,
    IonItemSliding,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonList,
    IonListHeader,
    IonSearchbar,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonContent,
    IonLabel,
    IonText,
    IonBackButton,
    IonAlert
  ]
})
export class Tab1Page {
  searchTerm = '';
  filteredItems: InventoryItem[] = [];
  items: InventoryItem[] = [];
  isAlertOpen = false;
  itemToDelete: string | null = null;

  // 枚举用于模板
  categories = Object.values(Category);
  stockStatuses = Object.values(StockStatus);

  // Alert 按钮配置
  alertButtons = [
    {
      text: '取消',
      role: 'cancel',
    },
    {
      text: '删除',
      role: 'confirm',
      handler: () => {
        this.deleteItem();
      }
    }
  ];

  constructor(
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.loadItems();
  }

  async loadItems() {
    try {
      const response = await this.inventoryService.getAllItems().toPromise();
      this.items = response || [];
      this.filteredItems = [...this.items];
    } catch (error) {
      console.error('加载物品失败:', error);
      // 处理路由错误
      if (error instanceof Error && error.message.includes('hybridaction')) {
        console.warn('忽略混合动作路由错误');
        return;
      }
      throw error;
    }
  }

  searchItems() {
    if (!this.searchTerm) {
      this.filteredItems = [...this.items];
      return;
    }
    this.filteredItems = this.items.filter(item => 
      item.itemName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  confirmDelete(itemName: string) {
    this.itemToDelete = itemName;
    this.isAlertOpen = true;
  }

  async deleteItem() {
    if (!this.itemToDelete) return;
    
    try {
      await this.inventoryService.deleteItem(this.itemToDelete).toPromise();
      this.items = this.items.filter(item => item.itemName !== this.itemToDelete);
      this.filteredItems = [...this.items];
    } catch (error) {
      console.error('删除失败:', error);
      if (error instanceof Error && error.message.includes('hybridaction')) {
        console.warn('忽略混合动作路由错误');
        return;
      }
    } finally {
      this.isAlertOpen = false;
      this.itemToDelete = null;
    }
  }

  onAlertDismiss() {
    this.isAlertOpen = false;
    this.itemToDelete = null;
  }

  openHelp() {
    this.router.navigate(['/help']); // 确保有对应的路由
  }

  editItem(itemName: string) {
    this.router.navigate(['/edit', encodeURIComponent(itemName)]);
  }

  getFeaturedItems(): InventoryItem[] {
    return this.items.filter(item => item.featured === 1);
  }
}