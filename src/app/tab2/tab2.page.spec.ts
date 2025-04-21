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
  categories = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  stockStatuses = ['In stock', 'Low stock', 'Out of stock'];

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
        if (data.length > 0) {
          this.item.itemName = data[0].item_name;
          this.item.category = data[0].category;
          this.item.quantity = data[0].quantity;
          this.item.price = data[0].price;
          this.item.supplierName = data[0].supplier_name;
          this.item.stockStatus = data[0].stock_status;
          this.item.featured = data[0].featured_item;
          this.item.specialNotes = data[0].special_notes;
        }

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
      this.http.put(url + this.item.itemName, {
        item_name: this.item.itemName,
        category: this.item.category,
        quantity: this.item.quantity,
        price: this.item.price,
        supplier_name: this.item.supplierName,
        stock_status: this.item.stockStatus,
        featured_item: this.item.featured,
        special_notes: this.item.specialNotes
      }).subscribe({
        next: () => this.router.navigate(['/tabs/tab1']),
        error: () => this.isAlertOpen = true
      });
    } else {
      this.http.post(url, {
        item_name: this.item.itemName,
        category: this.item.category,
        quantity: this.item.quantity,
        price: this.item.price,
        supplier_name: this.item.supplierName,
        stock_status: this.item.stockStatus,
        featured_item: this.item.featured,
        special_notes: this.item.specialNotes
      }).subscribe({
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
