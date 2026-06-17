import type { BudgetCat, Project } from './types';

export const fmt = (n: number | string) => {
  const v = Number(n);
  if (isNaN(v)) return '0';
  return v.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

export const getCatSum = (c: BudgetCat) => {
  const allocUsable = Math.round(c.allocTotal * (c.usagePct || 100) / 100);
  const paid = (c.transactions || []).reduce((s, t) => s + t.amount, 0);
  return { allocTotal: c.allocTotal, usagePct: c.usagePct || 100, allocUsable, paid, rem: allocUsable - paid };
};

export const getPjSum = (p: Project) => {
  const cats = p.budgetCats || [];
  const sums = cats.map(getCatSum);
  return {
    allocTotal: sums.reduce((s, x) => s + x.allocTotal, 0),
    allocUsable: sums.reduce((s, x) => s + x.allocUsable, 0),
    paid: sums.reduce((s, x) => s + x.paid, 0),
    rem: sums.reduce((s, x) => s + x.rem, 0),
    catCount: cats.length,
  };
};
