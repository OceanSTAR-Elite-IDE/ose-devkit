import { Injectable } from '@angular/core';

import { fade } from './fade-animation-preset';
import {
  NcNotifierAnimationData,
  NcNotifierAnimationPreset,
  NcNotifierAnimationPresetKeyframes,
} from './notifier-animation-data';
import { NcNotifierRef } from './notifier-ref';
import { slide } from './slide-animation-preset';

export type AnimationPresetsMap = { [animationPresetName: string]: NcNotifierAnimationPreset };

/**
 * Notifier animation service
 */
@Injectable({ providedIn: 'root' })
export class NcNotifierAnimation {
  prev: any = null;

  /**
   * List of animation presets (currently static)
   */
  private readonly _animationPresets: AnimationPresetsMap = { fade, slide };

  /**
   * Get animation data
   *
   * This method generates all data the Web Animations API needs to animate our notification. The result depends on both the animation
   * direction (either in or out) as well as the notifications (and its attributes) itself.
   *
   * @param   direction    Animation direction, either in or out
   * @param   notification Notification the animation data should be generated for
   * @returns Animation information
   */
  getAnimationData(direction: 'show' | 'hide', notification: NcNotifierRef): NcNotifierAnimationData {
    // Get all necessary animation data
    let keyframes: NcNotifierAnimationPresetKeyframes;
    let duration: number;
    let easing: string;
    if (direction === 'show') {
      keyframes = this._animationPresets[notification.component.getConfig().animations.show.preset].show(notification);
      duration = notification.component.getConfig().animations.show.speed;
      easing = notification.component.getConfig().animations.show.easing;
    } else {
      keyframes = this._animationPresets[notification.component.getConfig().animations.hide.preset].hide(notification);
      duration = notification.component.getConfig().animations.hide.speed;
      easing = notification.component.getConfig().animations.hide.easing;
    }

    // Build and return animation data
    return {
      keyframes: [keyframes.from, keyframes.to],
      options: {
        duration,
        easing,
        fill: 'forwards', // Keep the newly painted state after the animation finished
      },
    };
  }
}
