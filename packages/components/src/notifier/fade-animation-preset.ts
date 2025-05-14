import { NcNotifierAnimationPreset, NcNotifierAnimationPresetKeyframes } from './notifier-animation-data';

/**
 * Fade animation preset
 */
export const fade: NcNotifierAnimationPreset = {
  hide: (): NcNotifierAnimationPresetKeyframes => {
    return {
      from: { opacity: '1' },
      to: { opacity: '0' },
    };
  },
  show: (): NcNotifierAnimationPresetKeyframes => {
    return {
      from: { opacity: '0' },
      to: { opacity: '1' },
    };
  },
};
