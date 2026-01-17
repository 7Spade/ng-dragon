/**
 * Shared Enums
 * 
 * 共享的列舉,可在所有領域模型中使用
 */

export {
  LifecycleStatus,
  isActiveLifecycle,
  isRecoverableLifecycle,
  isTerminatedLifecycle,
  getLifecycleStatusDisplayName,
  LifecycleTransitions,
  canTransitionLifecycle,
} from './lifecycle-status.enum';
