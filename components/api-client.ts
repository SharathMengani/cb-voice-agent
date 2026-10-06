import { localApiFetch } from './local-api';

export function apiFetch(path, options = {}) {
  return localApiFetch(path, options);
}
