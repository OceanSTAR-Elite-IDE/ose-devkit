import { Inject, Injectable, Optional } from '@angular/core';

import { NcNotifierConfig } from './notifier-config';
import { NcNotifierQueue } from './notifier-queue';
import { NcNotifierOptions } from './notifier-ref';
import { NC_NOTIFIER_CONFIG } from './notifier-tokens';

/**
 * Notifier service
 *
 * This service provides access to the public notifier API. Once injected into a component, directive, pipe, service, or any other building
 * block of an applications, it can be used to show new notifications, and hide existing ones. Internally, it transforms API calls into
 * actions, which then get thrown into the action queue - eventually being processed at the right moment.
 */
@Injectable({ providedIn: 'root' })
export class NcNotifierService {
  public get queueService(): NcNotifierQueue {
    return this._queueService;
  }
  public set queueService(value: NcNotifierQueue) {
    this._queueService = value;
  }

  constructor(
    private _queueService: NcNotifierQueue,
    @Optional() @Inject(NC_NOTIFIER_CONFIG) private _config: NcNotifierConfig,
  ) {
    this._config = { ..._config };
  }

  /**
   * Get the notifier configuration
   *
   * @returns Notifier configuration
   */
  getConfig(): NcNotifierConfig {
    return this._config;
  }

  /**
   * API: Show a new notification
   *
   * @param notificationOptions Notification options
   */
  show(notificationOptions: NcNotifierOptions): void {
    this._queueService.push({
      payload: notificationOptions,
      type: 'SHOW',
    });
  }

  /**
   * API: Hide a specific notification, given its ID
   *
   * @param notificationId ID of the notification to hide
   */
  hide(notificationId: string): void {
    this._queueService.push({
      payload: notificationId,
      type: 'HIDE',
    });
  }

  /**
   * API: Hide the newest notification
   */
  hideNewest(): void {
    this._queueService.push({
      type: 'HIDE_NEWEST',
    });
  }

  /**
   * API: Hide the oldest notification
   */
  hideOldest(): void {
    this._queueService.push({
      type: 'HIDE_OLDEST',
    });
  }

  /**
   * API: Hide all notifications at once
   */
  hideAll(): void {
    this._queueService.push({
      type: 'HIDE_ALL',
    });
  }

  /**
   * API: Shortcut for showing a new notification
   *
   * @param type             Type of the notification
   * @param message          Message of the notification
   * @param [notificationId] Unique ID for the notification (optional)
   */
  notify(type: string, message: string, notificationId?: string): void {
    let notificationOptions: NcNotifierOptions = { message, type };
    if (notificationId !== undefined) {
      notificationOptions.id = notificationId;
    }
    this.show(notificationOptions);
  }
}
