/**
 * Core Engine Ports - Event Sourcing Infrastructure
 * 
 * Exports all port interfaces and base implementations for event sourcing
 */

// Event Store
export * from './event-store.interface';

// Event Replayer
export * from './event-replayer.interface';

// Event Projector
export * from './event-projector.interface';

// Aggregate Repository
export * from './aggregate-repository.interface';
