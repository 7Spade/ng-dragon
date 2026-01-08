export interface CounterMetric {
  name: string;
  labels?: Record<string, string>;
}

/** No-op metrics placeholder; swap with Cloud Monitoring when available. */
export const incrementCounter = ({ name, labels }: CounterMetric, amount = 1): void => {
  console.debug('[metric]', name, amount, labels);
};
