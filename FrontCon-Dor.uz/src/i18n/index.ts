import { uz } from './uz';
import { ru } from './ru';

export type Lang = 'uz' | 'ru';

export const translations: Record<Lang, Record<string, string>> = { uz, ru };
