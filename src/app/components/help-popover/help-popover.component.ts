import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

/**
 * HelpPopoverComponent is a standalone Angular component that displays a popover with customizable content.
 * The content is passed as an input property and rendered using Angular's innerHTML directive.
 * The component also includes custom styles for light and dark themes.
 */
@Component({
    selector: 'app-help-popover',
    template: `
    <ion-content class="ion-padding">
      <div [innerHTML]="content"></div>
    </ion-content>
  `,
    styles: [`
    :host {
      --width: 300px;
      --max-height: 80vh;
      --primary-color: #b399d4;
      --secondary-color: #e6e6fa;
      --accent-color: #9370db;
      --text-color: #4b0082;
      --background-color: #faf5ff;
    }
    ion-content {
      --background: var(--background-color);
    }
    h2 {
      color: var(--primary-color);
      margin-bottom: 16px;
      font-weight: bold;
    }
    p {
      margin: 8px 0;
      color: var(--text-color);
    }
    ul {
      margin: 8px 0;
      padding-left: 20px;
      color: var(--text-color);
    }
    li {
      margin: 4px 0;
    }
    @media (prefers-color-scheme: dark) {
      :host {
        --background-color: #1e103a;
        --text-color: #e6e6fa;
        --primary-color: #9370db;
        --secondary-color: #4b0082;
      }
    }
  `],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class HelpPopoverComponent {
    /**
     * The content to be displayed inside the popover.
     * This input property allows for dynamic HTML content to be passed into the component.
     */
    @Input() content: string = '';
}