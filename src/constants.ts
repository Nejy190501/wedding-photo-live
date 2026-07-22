import { ThemeColor, ThemeStyles } from './types';

export const THEMES: Record<ThemeColor, ThemeStyles> = {
  rose: {
    bg: 'bg-rose-50/50',
    primary: 'text-rose-600',
    accent: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
    text: 'text-rose-950',
    border: 'border-rose-100',
    btn: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200',
    gradient: 'from-rose-500 to-pink-600'
  },
  emerald: {
    bg: 'bg-emerald-50/50',
    primary: 'text-emerald-700',
    accent: 'bg-emerald-700 hover:bg-emerald-800 text-white focus:ring-emerald-500',
    text: 'text-emerald-950',
    border: 'border-emerald-100',
    btn: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
    gradient: 'from-emerald-600 to-teal-600'
  },
  violet: {
    bg: 'bg-violet-50/50',
    primary: 'text-violet-600',
    accent: 'bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500',
    text: 'text-violet-950',
    border: 'border-violet-100',
    btn: 'bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-200',
    gradient: 'from-violet-600 to-fuchsia-600'
  },
  amber: {
    bg: 'bg-amber-50/50',
    primary: 'text-amber-700',
    accent: 'bg-amber-700 hover:bg-amber-800 text-white focus:ring-amber-500',
    text: 'text-amber-950',
    border: 'border-amber-100',
    btn: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200',
    gradient: 'from-amber-600 to-yellow-600'
  },
  slate: {
    bg: 'bg-slate-50/50',
    primary: 'text-slate-800',
    accent: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-500',
    text: 'text-slate-950',
    border: 'border-slate-200',
    btn: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300',
    gradient: 'from-slate-700 to-slate-900'
  }
};
