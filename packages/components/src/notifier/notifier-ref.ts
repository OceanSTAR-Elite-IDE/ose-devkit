import { TemplateRef } from '@angular/core';

import { NcNotifier } from './notifier';

/**
 * Notification
 *
 * This class describes the structure of a notifiction, including all information it needs to live, and everyone else needs to work with it.
 */
export class NcNotifierRef {
  /**
   * Unique notification ID, can be set manually to control the notification from outside later on
   */
  id!: string;

  /**
   * Notification type, will be used for constructing an appropriate class name
   */
  type!: string;

  /**
   * Notification message
   */
  message!: string;

  /**
   * The template to customize
   * the appearance of the notification
   */
  template: TemplateRef<any> | null = null;

  /**
   * Component reference of this notification, created and set during creation time
   */
  component!: NcNotifier;

  /**
   * Constructor
   *
   * @param options Notifier options
   */
  constructor(options: NcNotifierOptions) {
    Object.assign(this, options);

    // If not set manually, we have to create a unique notification ID by ourselves. The ID generation relies on the current browser
    // datetime in ms, in praticular the moment this notification gets constructed. Concurrency, and thus two IDs being the exact same,
    // is not possible due to the action queue concept.
    if (options.id === undefined) {
      this.id = `ID_${new Date().getTime()}`;
    }
  }
}

/**
 * Notifiction options
 *
 * This interface describes which information are needed to create a new notification, or in other words, which information the external API
 * call must provide.
 */
export interface NcNotifierOptions {
  /**
   * Notification ID, optional
   */
  id?: string;

  /**
   * Notification type
   */
  type: string;

  /**
   * Notificatin message
   */
  message: string;

  /**
   * The template to customize
   * the appearance of the notification
   */
  template?: TemplateRef<any>;
}
