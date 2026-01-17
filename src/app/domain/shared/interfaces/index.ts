/**
 * Shared Interfaces
 * 
 * 共享的介面,可在所有領域模型中使用
 */

export {
  Identifiable,
  isIdentifiable,
  extractIds,
  findById,
  filterByIds,
  hasId,
} from './identifiable.interface';

export {
  Auditable,
  PartiallyAuditable,
  isAuditable,
  isPartiallyAuditable,
  createAuditMetadata,
  updateAuditMetadata,
} from './auditable.interface';

export {
  Versionable,
  EnhancedVersionable,
  VersionHistoryEntry,
  isVersionable,
  incrementVersion,
  checkVersionConflict,
  createVersionHistoryEntry,
  addVersionHistory,
} from './versionable.interface';
