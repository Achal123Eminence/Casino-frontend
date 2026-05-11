import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

import { ToastModule } from 'primeng/toast';
import { routes } from '../../../../shared/routes/routes';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-ui-toasts',
    templateUrl: './ui-toasts.component.html',
    styleUrl: './ui-toasts.component.scss',
    providers: [MessageService],
    imports: [ToastModule,RouterLink]
})
export class UiToastsComponent {
  public routes = routes;
  /**
   * constructor function.
   * @param {*} messageService - Parameter.
   * @returns {*} Result.
   */
  constructor(private messageService: MessageService) {}

  /**
   * show function.
   * @returns {*} Result.
   */
  show() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Hello, world! This is a toast message.',
    });
  }

  /**
   * showPrimaryColor function.
   * @returns {*} Result.
   */
  showPrimaryColor() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'primary-light-popover',
    });
  }

  /**
   * showSecondaryColor function.
   * @returns {*} Result.
   */
  showSecondaryColor() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'secondary-light-popover',
    });
  }

  /**
   * showWarningColor function.
   * @returns {*} Result.
   */
  showWarningColor() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'primary-light-popover',
    });
  }

  /**
   * showInfoColor function.
   * @returns {*} Result.
   */
  showInfoColor() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'info-light-popover',
    });
  }
  /**
   * showSuccessColor function.
   * @returns {*} Result.
   */
  showSuccessColor() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'success-light-popover',
    });
  }
  /**
   * showDangerColor function.
   * @returns {*} Result.
   */
  showDangerColor() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'danger-light-popover',
    });
  }
  /**
   * showPrimaryBackground function.
   * @returns {*} Result.
   */
  showPrimaryBackground() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'primary-background-popover',
    });
  }

  /**
   * showSecondaryBackground function.
   * @returns {*} Result.
   */
  showSecondaryBackground() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'secondary-background-popover',
    });
  }

  /**
   * showWarningBackground function.
   * @returns {*} Result.
   */
  showWarningBackground() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'warning-background-popover',
    });
  }

  /**
   * showInfoBackground function.
   * @returns {*} Result.
   */
  showInfoBackground() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'info-background-popover',
    });
  }
  /**
   * showSuccessBackground function.
   * @returns {*} Result.
   */
  showSuccessBackground() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'success-background-popover',
    });
  }
  /**
   * showDangerBackground function.
   * @returns {*} Result.
   */
  showDangerBackground() {
    this.messageService.add({
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'danger-background-popover',
    });
  }

  /**
   * showTopLeft function.
   * @returns {*} Result.
   */
  showTopLeft() {
    this.messageService.add({
      key: 'tl',
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'primary-light-popover',
    });
  }

  /**
   * showTopCenter function.
   * @returns {*} Result.
   */
  showTopCenter() {
    this.messageService.add({
      key: 'tc',
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'primary-light-popover',
    });
  }

  /**
   * showTopRight function.
   * @returns {*} Result.
   */
  showTopRight() {
    this.messageService.add({
      key: 'tr',
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'primary-light-popover',
    });
  }

  /**
   * showMiddleLeft function.
   * @returns {*} Result.
   */
  showMiddleLeft() {
    this.messageService.add({
      key: 'ml',
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'primary-light-popover',
    });
  }

  /**
   * showBottomLeft function.
   * @returns {*} Result.
   */
  showBottomLeft() {
    this.messageService.add({
      key: 'bl',
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'primary-light-popover',
    });
  }

  /**
   * showBottomCenter function.
   * @returns {*} Result.
   */
  showBottomCenter() {
    this.messageService.add({
      key: 'bc',
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'primary-light-popover',
    });
  }

  /**
   * showBottomRight function.
   * @returns {*} Result.
   */
  showBottomRight() {
    this.messageService.add({
      key: 'br',
      summary: 'Toast',
      detail: 'Your,toast message here.',
      styleClass: 'primary-light-popover',
    });
  }
}
