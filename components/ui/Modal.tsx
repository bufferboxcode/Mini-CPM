'use client';
import { C } from '@/lib/constants';
import type { ReactNode, ChangeEvent } from 'react';

export function Backdrop({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,5,38,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>
  );
}

export function ModalBox({ title, width, children, onClose }: { title: string; width?: string; children: ReactNode; onClose: () => void }) {
  return (
    <div style={{ background: C.white, borderRadius: '20px', padding: '28px', width: width ?? '460px', maxWidth: '90vw', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div style={{ fontSize: '17px', fontWeight: '700', color: C.text }}>{title}</div>
        <button onClick={onClose} className="btn-ghost" style={{ width: '32px', height: '32px', borderRadius: '8px', background: C.ghost, border: 'none', cursor: 'pointer', color: C.sub, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
      </div>
      {children}
    </div>
  );
}

export function MI({ label, type, value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: '13px' }}>
      <div style={{ color: C.sub, fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>{label}</div>
      <input
        type={type ?? 'text'} value={value} onChange={onChange} placeholder={placeholder ?? label}
        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1.5px solid ${C.line}`, fontSize: '14px', color: C.text, fontFamily: "'SaoChingcha',sans-serif", background: C.paper, outline: 'none', boxSizing: 'border-box', display: 'block', transition: 'border-color 0.15s ease, box-shadow 0.15s ease' }}
      />
    </div>
  );
}

export function MRow({ children }: { children: ReactNode[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: children.map(() => '1fr').join(' '), gap: '12px', marginBottom: '0' }}>
      {children}
    </div>
  );
}

export function MSave({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-primary" style={{ width: '100%', padding: '13px', borderRadius: '12px', background: `linear-gradient(135deg,${C.deep},${C.primary})`, border: 'none', color: 'white', fontSize: '15px', fontWeight: '700', fontFamily: "'SaoChingcha',sans-serif", cursor: 'pointer', marginTop: '8px' }}>
      {label}
    </button>
  );
}
