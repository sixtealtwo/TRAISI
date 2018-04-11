import { Component, EventEmitter, OnInit, ElementRef, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';
import { AppTranslationService } from '../../services/app-translation.service';
import { ConfigurationService } from '../../services/configuration.service';
declare let jQuery: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.template.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
  @Output() logoutEvent: EventEmitter<any> = new EventEmitter();

  @Input() userName: string;
  $el: any;
  config: any;

  constructor(el: ElementRef, config: AppConfig, private router: Router,
    private translationService: AppTranslationService, public configurations: ConfigurationService) {
    this.$el = jQuery(el.nativeElement);
    this.config = config.getConfig();
  }

  toggleSidebar(state): void {
    this.toggleSidebarEvent.emit(state);
  }

  logout(): void {
    this.logoutEvent.emit();
  }

  refreshPage() {
    this.router.navigate([this.router.url]);
  }

  ngOnInit(): void {
    this.$el.find('.input-group-addon + .form-control').on('blur focus', function(e): void {
      jQuery(this).parents('.input-group')
        [e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
    });
  }
}
