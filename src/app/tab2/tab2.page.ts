// tab2.page.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  // 用于判断是否是编辑模式
  isEditMode = false;

  // 表单字段
  item: any = {
    itemName: '',
    category: '',
    quantity: 0,
    price: 0,
    supplierName: '',
    stockStatus: '',
    featured: 0,
    specialNotes: ''
  };

  // 选择器选项
  categories = ['电子产品', '家具', '服装', '工具', '杂项'];
  stockStatuses = ['有货', '低库存', '缺货'];

  isAlertOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const itemName = this.route.snapshot.paramMap.get('name');
    if (itemName) {
      this.isEditMode = true;
      this.loadItem(itemName);
    }
  }

  loadItem(name: string) {
    this.http.get(`https://prog2005.it.scu.edu.au/ArtGalley/${name}`).subscribe({
      next: (data: any) => {
        this.item = data;
      },
      error: () => {
        this.isAlertOpen = true;
      }
    });
  }

  saveItem() {
    if (!this.item.itemName || !this.item.category || !this.item.quantity || !this.item.price || !this.item.supplierName || !this.item.stockStatus) {
      this.isAlertOpen = true;
      return;
    }

    const url = 'https://prog2005.it.scu.edu.au/ArtGalley/';
    if (this.isEditMode) {
      this.http.put(url + this.item.itemName, this.item).subscribe({
        next: () => this.router.navigate(['/tabs/tab1']),
        error: () => this.isAlertOpen = true
      });
    } else {
      this.http.post(url, this.item).subscribe({
        next: () => this.router.navigate(['/tabs/tab1']),
        error: () => this.isAlertOpen = true
      });
    }
  }

  cancel() {
    this.router.navigate(['/tabs/tab1']);
  }

  setOpen(state: boolean) {
    this.isAlertOpen = state;
  }
}
