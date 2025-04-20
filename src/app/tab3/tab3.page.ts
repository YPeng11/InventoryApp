import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular'; // <--- 导入 IonicModule
import { CommonModule } from '@angular/common'; // <--- 导入 CommonModule (如果需要 *ngIf, *ngFor 等)
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule],
  standalone: true, // <--- 关键：标记为独立组件
})
export class Tab3Page {

  constructor(private alertCtrl: AlertController) {}

  /**
   * 显示帮助信息的弹窗
   */
  async showHelp() {
    const alert = await this.alertCtrl.create({
      header: 'Help - Privacy & Security',
      message: `
        <p>This page outlines the privacy and security aspects of the application.</p>
        <ul>
          <li><strong>Data Transmission:</strong> How data is sent to the server.</li>
          <li><strong>Data Storage:</strong> Where inventory data resides.</li>
          <li><strong>Security:</strong> Notes on authentication and data protection.</li>
          <li><strong>Unique Names:</strong> Backend enforcement of unique item names.</li>
        </ul>
        <p>Read through the details provided on this page for a full understanding.</p>
      `,
      buttons: ['OK']
    });

    await alert.present();
  }
}