export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export function apiFetch(path,options={}) { return fetch(path.startsWith('http')?path:`${API}${path}`,{credentials:'include',...options}); }
