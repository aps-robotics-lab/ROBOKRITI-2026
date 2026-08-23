import { db } from './firebase-init.js';
import { ref, push, set, update, get, remove, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js';
export { db, ref, push, set, update, get, remove, query, orderByChild, equalTo };
export function makeId(prefix){return `${prefix}-${Math.random().toString(36).slice(2,8).toUpperCase()}${Date.now().toString(36).slice(-3).toUpperCase()}`}
