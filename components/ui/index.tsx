'use client';
import { C, statusCfg, type StatusKey } from '@/lib/constants';
import type { ReactNode } from 'react';

export function Badge({ status }: { status: string }) {
  const sc = statusCfg[status as StatusKey] ?? { label: status, color: C.sub, bg: C.ghost };
  return (
    <span style={{ background: sc.bg, color: sc.color, fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
      {sc.label}
    </span>
  );
}

export function TopBar({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div style={{ height: '60px', background: C.white, borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0 }}>
      <div>
        <div style={{ fontSize: '17px', fontWeight: '700', color: C.text, lineHeight: '1.2' }}>{title}</div>
        {sub && <div style={{ fontSize: '11px', color: C.sub, marginTop: '1px' }}>{sub}</div>}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>{actions}</div>
    </div>
  );
}

export function PrimaryBtn({ label, onClick, noIcon }: { label: string; onClick: () => void; noIcon?: boolean }) {
  return (
    <button onClick={onClick} style={{ background: `linear-gradient(135deg,${C.deep},${C.primary})`, border: 'none', color: 'white', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
      {!noIcon && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}
      {label}
    </button>
  );
}

export function GhostBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: C.ghost, border: 'none', color: C.primary, padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>
      {label}
    </button>
  );
}

export function IcoEdit({ color }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M16.86 4.14a2 2 0 0 1 2.83 2.83L7.5 19.16l-4 1 1-4L16.86 4.14z" stroke={color ?? C.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcoDel() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
