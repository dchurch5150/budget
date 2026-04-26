export type { SourceAdapter } from './types';
export { genericAdapter } from './generic';
export { wellsFargoAdapter } from './wells-fargo';
export { fidelityAdapter } from './fidelity';

import type { SourceAdapter } from './types';
import { genericAdapter } from './generic';
import { wellsFargoAdapter } from './wells-fargo';
import { fidelityAdapter } from './fidelity';

export const ADAPTERS: SourceAdapter[] = [genericAdapter, wellsFargoAdapter, fidelityAdapter];

export function getAdapter(id: string): SourceAdapter {
  return ADAPTERS.find((a) => a.id === id) ?? genericAdapter;
}
