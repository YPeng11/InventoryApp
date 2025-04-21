import { ChangeDetectorRef, Component } from '@angular/core';
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
  IonListHeader,
  PopoverController
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, Category, StockStatus } from '../models/item';
import { HttpClientModule } from '@angular/common/http';
import { HelpPopoverComponent } from '../components/help-popover/help-popover.component';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HttpClientModule,
    HelpPopoverComponent,
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
  showingFeaturedOnly = false;

  // 枚举用于模板
  categories = Object.values(Category);
  stockStatuses = Object.values(StockStatus);
  toggleFeaturedFilter() { this.showingFeaturedOnly = !this.showingFeaturedOnly; this.filterItems(); }

  // Alert 按钮配置
  alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Delete',
      role: 'confirm',
      handler: () => {
        this.deleteItem();
      }
    }
  ];

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private popoverController: PopoverController
  ) { }

  ionViewWillEnter() {
    this.inventoryService.getAllItems().subscribe(items => {
      this.items = items || [];
      this.filterItems(); // 调用 filterItems 方法
      console.log('获取到项目：', this.items);
    });
  }

  async loadItems() {
    try {
      const response = await this.inventoryService.getAllItems().toPromise();
      this.items = response || [];
      this.filterItems(); // 调用 filterItems 方法
    } catch (error) {
      console.error('加载物品失败:', error);
      if (error instanceof Error && error.message.includes('hybridaction')) {
        console.warn('忽略混合动作路由错误');
        return;
      }
      throw error;
    }
  }
  filterItems() {
    const term = this.searchTerm?.toLowerCase().trim() || '';
    let base = [...this.items];

    if (this.showingFeaturedOnly) {
      base = base.filter(item => item.featured === 1);
    }

    if (term) {
      this.filteredItems = base.filter(item =>
        item.itemName?.toLowerCase().includes(term)
      );
    } else {
      this.filteredItems = base;
    }
  }
  searchItems() {
    this.filterItems();
  }

  confirmDelete(itemName: string) {
    this.itemToDelete = itemName;
    this.isAlertOpen = true;
  }

  async deleteItem() {
    if (!this.itemToDelete) return;

    try {
      const name = this.itemToDelete
      await this.inventoryService.deleteItem(this.itemToDelete).toPromise();
      this.items = this.items.filter(item => item.itemName !== name);
      this.filteredItems = [...this.items];
      this.cdr.detectChanges();
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

  async presentHelpPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: HelpPopoverComponent,
      event: ev,
      translucent: true,
      cssClass: 'help-popover',
      componentProps: {
        content: `
          <h2>Inventory Management Help</h2>
          <p>1. Search: Use the top search bar to quickly find items</p>
          <p>2. Featured Items: Shows important items marked as featured</p>
          <p>3. Item List: Displays all inventory items</p>
          <p>4. Actions:</p>
          <ul>
            <li>Click on an item to view/edit details</li>
            <li>Swipe left to delete an item</li>
            <li>Click the "+" button in the bottom right to add a new item</li>
          </ul>
        `
      }
    });
    await popover.present();
  }

//编辑项目
  editItem(itemName: string) {
    console.log('跳转编辑页面，itemName:', itemName);
    this.router.navigate(['/edit', encodeURIComponent(itemName)]);
  }

  // 筛选出所有 `featured` 属性为 1 的库存项目
  getFeaturedItems(): InventoryItem[] {
    return this.items.filter(item => item.featured === 1);
  }
}
