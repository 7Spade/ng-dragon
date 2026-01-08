export type LogSeverity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface StructuredLog {
  message: string;
  severity?: LogSeverity;
  data?: Record<string, unknown>;
}

/** Lightweight console-based logger placeholder. Replace with GCP Logging if needed. */
export const logStructured = ({ message, data, severity = 'INFO' }: StructuredLog): void => {
  const payload = { severity, message, ...(data ? { data } : {}) };
  if (severity === 'ERROR' || severity === 'WARN') {
    console.error(payload);
    return;
  }
  console.log(payload);
};
