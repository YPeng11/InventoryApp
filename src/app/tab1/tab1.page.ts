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
    private router: Router,
    private cdr: ChangeDetectorRef,
    private popoverController: PopoverController
  ) { }

  ionViewWillEnter() {
    this.inventoryService.getAllItems().subscribe(items => {
      this.items = items || [];
      this.filteredItems = [...this.items];
      console.log('获取到项目：', this.items);

    });
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
    const term = this.searchTerm?.toLowerCase().trim() || '';

    if (!term) {
      this.filteredItems = [...this.items];
      return;
    }

    this.filteredItems = this.items.filter(item =>
      item.itemName?.toLowerCase().includes(term)
    );
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
          <h2>库存管理帮助</h2>
          <p>1. 搜索：使用顶部搜索栏可以快速查找物品</p>
          <p>2. 特色项目：显示标记为特色的重要物品</p>
          <p>3. 物品列表：显示所有库存物品</p>
          <p>4. 操作：</p>
          <ul>
            <li>点击物品可查看/编辑详情</li>
            <li>左滑可删除物品</li>
            <li>点击右下角"+"添加新物品</li>
          </ul>
        `
      }
    });
    await popover.present();
  }

  editItem(itemName: string) {
    console.log('跳转编辑页面，itemName:', itemName);
    this.router.navigate(['/edit', encodeURIComponent(itemName)]);
  }


  getFeaturedItems(): InventoryItem[] {
    return this.items.filter(item => item.featured === 1);
  }
}
