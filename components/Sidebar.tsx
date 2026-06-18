'use client';
import { C } from '@/lib/constants';
import type { AppState } from '@/lib/types';
import type { SharedProps } from './PeaApp';

function IcoDash({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2" fill={color} />
      <rect x="13" y="3" width="8" height="8" rx="2" fill={color} opacity="0.5" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill={color} opacity="0.5" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill={color} />
    </svg>
  );
}
function IcoList({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="2.5" rx="1.25" fill={color} />
      <rect x="3" y="11" width="13" height="2.5" rx="1.25" fill={color} />
      <rect x="3" y="17" width="9" height="2.5" rx="1.25" fill={color} />
    </svg>
  );
}
function IcoDoc({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="3" stroke={color} strokeWidth="1.6" fill="none" />
      <line x1="8" y1="8" x2="16" y2="8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="8" y1="12" x2="14" y2="12" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Sidebar({ S, update, ws }: SharedProps) {
  const navItems = [
    { key: 'dashboard', label: 'ภาพรวม', Icon: IcoDash },
    { key: 'projects', label: 'โปรเจ็ค', Icon: IcoList },
    { key: 'report', label: 'รายงาน', Icon: IcoDoc },
  ] as const;

  return (
    <div style={{ width: '232px', flexShrink: 0, background: `linear-gradient(180deg,${C.sb} 0%,${C.sbMid} 100%)`, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Logo */}
      <div style={{ padding: '24px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="MiniCPM Logo" style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
          <div>
            <div style={{ color: 'white', fontSize: '16px', fontWeight: '700', lineHeight: '1.2' }}>MiniCPM</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '0.5px' }}>การไฟฟ้าส่วนภูมิภาค</div>
          </div>
        </div>
      </div>

      {/* Workspace selector */}
      <div style={{ padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '7px' }}>WORKSPACE</div>
        <button
          onClick={() => update({ showWsDropdown: !S.showWsDropdown })}
          className="ws-btn"
          style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '9px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'SaoChingcha', sans-serif" }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{ws ? ws.name : 'เลือก Workspace'}</div>
            {ws && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '1px' }}>ปี {ws.year} • {ws.projects.length} แฟ้ม</div>}
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {S.showWsDropdown && (
          <div style={{ position: 'absolute', left: '14px', right: '14px', top: '80px', background: C.white, borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)', zIndex: 50, overflow: 'hidden' }}>
            {S.workspaces.map(w => (
              <button key={w.id} onClick={() => update({ selectedWorkspaceId: w.id, showWsDropdown: false, view: 'dashboard' })}
                className="ws-item"
                style={{ width: '100%', padding: '10px 14px', background: w.id === S.selectedWorkspaceId ? C.ghost : 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'SaoChingcha', sans-serif", borderBottom: `1px solid ${C.line}` }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: C.text, fontSize: '13px', fontWeight: '600' }}>{w.name}</div>
                  <div style={{ color: C.sub, fontSize: '10px' }}>{w.projects.length} โครงการ</div>
                </div>
                {w.id === S.selectedWorkspaceId && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.primary }} />}
              </button>
            ))}
            <button
              onClick={() => update({ showWsDropdown: false, showModal: 'add-workspace', form: { ...S.form, wsName: '', wsYear: '2569', wsDept: 'กฟภ. สาขาย่อย เขต 1', wsBudget: '' } })}
              style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', color: C.primary, fontSize: '12px', fontWeight: '600', fontFamily: "'SaoChingcha', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" /></svg>
              + สร้าง Workspace ใหม่
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {navItems.map(({ key, label, Icon }) => {
          const isA = S.view === key || (key === 'projects' && S.view === 'project-detail');
          const col = isA ? 'white' : 'rgba(255,255,255,0.42)';
          return (
            <button key={key} onClick={() => update({ view: key as AppState['view'], showWsDropdown: false })}
              className="nav-item"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isA ? 'rgba(255,255,255,0.1)' : 'none', border: isA ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px', fontFamily: "'SaoChingcha', sans-serif" }}>
              <Icon color={col} />
              <span style={{ color: col, fontSize: '13px', fontWeight: isA ? '600' : '400' }}>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile placeholder */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.6" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontStyle: 'italic' }}></div>
      </div>
    </div>
  );
}
