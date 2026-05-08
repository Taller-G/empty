import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName = 
  | 'user' 
  | 'users' 
  | 'plus' 
  | 'edit' 
  | 'trash' 
  | 'search' 
  | 'home' 
  | 'info' 
  | 'check' 
  | 'x' 
  | 'arrow-right' 
  | 'arrow-left'
  | 'refresh'
  | 'menu'
  | 'close'
  | 'loading'
  | 'warning'
  | 'success'
  | 'error'
  | 'weather'
  | 'cloud'
  | 'sun';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      [attr.width]="size" 
      [attr.height]="size" 
      [attr.viewBox]="viewBox"
      [class]="'icon icon-' + name + (className ? ' ' + className : '')"
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <ng-container [ngSwitch]="name">
        <!-- User -->
        <g *ngSwitchCase="'user'">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </g>
        
        <!-- Users -->
        <g *ngSwitchCase="'users'">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </g>
        
        <!-- Plus -->
        <g *ngSwitchCase="'plus'">
          <path d="M12 5v14"></path>
          <path d="M5 12h14"></path>
        </g>
        
        <!-- Edit -->
        <g *ngSwitchCase="'edit'">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path>
        </g>
        
        <!-- Trash -->
        <g *ngSwitchCase="'trash'">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </g>
        
        <!-- Search -->
        <g *ngSwitchCase="'search'">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        </g>
        
        <!-- Home -->
        <g *ngSwitchCase="'home'">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9,22 9,12 15,12 15,22"></polyline>
        </g>
        
        <!-- Info -->
        <g *ngSwitchCase="'info'">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </g>
        
        <!-- Check -->
        <g *ngSwitchCase="'check'">
          <polyline points="20,6 9,17 4,12"></polyline>
        </g>
        
        <!-- X -->
        <g *ngSwitchCase="'x'">
          <path d="M18 6L6 18"></path>
          <path d="M6 6l12 12"></path>
        </g>
        
        <!-- Arrow Right -->
        <g *ngSwitchCase="'arrow-right'">
          <path d="M5 12h14"></path>
          <path d="M12 5l7 7-7 7"></path>
        </g>
        
        <!-- Arrow Left -->
        <g *ngSwitchCase="'arrow-left'">
          <path d="M19 12H5"></path>
          <path d="M12 19l-7-7 7-7"></path>
        </g>
        
        <!-- Refresh -->
        <g *ngSwitchCase="'refresh'">
          <polyline points="23,4 23,10 17,10"></polyline>
          <polyline points="1,20 1,14 7,14"></polyline>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
        </g>
        
        <!-- Menu -->
        <g *ngSwitchCase="'menu'">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </g>
        
        <!-- Close -->
        <g *ngSwitchCase="'close'">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </g>
        
        <!-- Loading -->
        <g *ngSwitchCase="'loading'">
          <path d="M12 2v4"></path>
          <path d="M12 18v4"></path>
          <path d="M4.93 4.93l2.83 2.83"></path>
          <path d="M16.24 16.24l2.83 2.83"></path>
          <path d="M2 12h4"></path>
          <path d="M18 12h4"></path>
          <path d="M4.93 19.07l2.83-2.83"></path>
          <path d="M16.24 7.76l2.83-2.83"></path>
        </g>
        
        <!-- Warning -->
        <g *ngSwitchCase="'warning'">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </g>
        
        <!-- Success -->
        <g *ngSwitchCase="'success'">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22,4 12,14.01 9,11.01"></polyline>
        </g>
        
        <!-- Error -->
        <g *ngSwitchCase="'error'">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </g>
        
        <!-- Weather -->
        <g *ngSwitchCase="'weather'">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </g>
        
        <!-- Cloud -->
        <g *ngSwitchCase="'cloud'">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </g>
        
        <!-- Sun -->
        <g *ngSwitchCase="'sun'">
          <circle cx="12" cy="12" r="5"></circle>
          <path d="M12 1v2"></path>
          <path d="M12 21v2"></path>
          <path d="M4.22 4.22l1.42 1.42"></path>
          <path d="M18.36 18.36l1.42 1.42"></path>
          <path d="M1 12h2"></path>
          <path d="M21 12h2"></path>
          <path d="M4.22 19.78l1.42-1.42"></path>
          <path d="M18.36 5.64l1.42-1.42"></path>
        </g>
        
      </ng-container>
    </svg>
  `,
  styles: [`
    .icon {
      display: inline-block;
      vertical-align: middle;
      color: currentColor;
      transition: all var(--transition-fast);
    }
    
    .icon-loading {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  @Input() name: IconName = 'info';
  @Input() size: number | string = 20;
  @Input() className: string = '';
  
  get viewBox(): string {
    return '0 0 24 24';
  }
}