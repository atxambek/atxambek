import {SCARF_RED} from './props';

/** Sam: hair tuft always; the red scarf in every outdoor / leaving shot. */
export const SAM = {hair: 'tuft' as const};
export const SAM_OUT = {hair: 'tuft' as const, scarf: SCARF_RED};
/** Mom: elder build, bun, round glasses. */
export const MOM = {build: 'elder' as const, hair: 'bun' as const, glasses: true};

/** Days since the last call (Fri, Oct 30 2026). */
export const DAYS = {nov2: 3, nov3: 4, nov9: 10, nov22: 23, dec16: 47, dec20: 51};
