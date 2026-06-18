'use client';
import { C, statusCfg, catCfg, type StatusKey, type CatKey } from '@/lib/constants';
import { getCatSum, getPjSum, fmt } from '@/lib/utils';
import type { SharedProps } from '@/components/PeaApp';
import type { AppState } from '@/lib/types';
import type { ChangeEvent, ReactNode } from 'react';

// ── Shared helpers ─────────────────────────────────────────────────────────

function SheetHandle() {
  return <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: C.pale, margin: '0 auto 20px' }} />;
}

function SheetBackdrop({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,5,38,0.55)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{ background: C.white, borderRadius: '24px 24px 0 0', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function SInp({ label, type, value, onChange, placeholder }: {
  label: string; type?: string; value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: '13px' }}>
      <div style={{ color: C.sub, fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>{label}</div>
      <input
        type={type ?? 'text'} value={value} onChange={onChange} placeholder={placeholder ?? label}
        style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: `1.5px solid ${C.line}`, fontSize: '15px', color: C.text, fontFamily: "'SaoChingcha',sans-serif", background: C.paper, outline: 'none', boxSizing: 'border-box', display: 'block' }}
      />
    </div>
  );
}

function SBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: `linear-gradient(135deg,${C.deep},${C.primary})`, border: 'none', color: 'white', fontSize: '15px', fontWeight: '700', fontFamily: "'SaoChingcha',sans-serif", cursor: 'pointer', marginTop: '8px' }}>
      {label}
    </button>
  );
}

function MBadge({ status }: { status: string }) {
  const sc = statusCfg[status as StatusKey] ?? { label: status, color: C.sub, bg: C.ghost };
  return (
    <span style={{ background: sc.bg, color: sc.color, fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
      {sc.label}
    </span>
  );
}

// ── Bottom Nav ─────────────────────────────────────────────────────────────

function BottomNav({ screen, onNav }: { screen: string; onNav: (s: AppState['mobileScreen']) => void }) {
  const tabs: { key: AppState['mobileScreen']; label: string; icon: (c: string) => ReactNode }[] = [
    {
      key: 'dashboard', label: 'ภาพรวม',
      icon: (col) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8" rx="2" fill={col} />
          <rect x="13" y="3" width="8" height="8" rx="2" fill={col} opacity="0.5" />
          <rect x="3" y="13" width="8" height="8" rx="2" fill={col} opacity="0.5" />
          <rect x="13" y="13" width="8" height="8" rx="2" fill={col} />
        </svg>
      ),
    },
    {
      key: 'projects', label: 'โปรเจ็ค',
      icon: (col) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="2.5" rx="1.25" fill={col} />
          <rect x="3" y="11" width="13" height="2.5" rx="1.25" fill={col} />
          <rect x="3" y="17" width="9" height="2.5" rx="1.25" fill={col} />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ height: '65px', background: C.white, borderTop: `1px solid ${C.line}`, display: 'flex', flexShrink: 0, boxShadow: '0 -2px 16px rgba(107,63,160,0.08)' }}>
      {tabs.map(t => {
        const isA = screen === t.key;
        const col = isA ? C.primary : C.sub;
        return (
          <button key={t.key} onClick={() => onNav(t.key)}
            style={{ flex: 1, background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>
            {t.icon(col)}
            <span style={{ color: col, fontSize: '11px', fontWeight: isA ? '700' : '400' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── WorkspaceList Screen ───────────────────────────────────────────────────

function WorkspaceListScreen({ S, update }: SharedProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.paper }}>
      <div style={{ background: `linear-gradient(180deg,${C.sb},${C.sbMid})`, padding: '24px 20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <img src="/logo.png" alt="MiniCPM Logo" style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
          <div>
            <div style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>MiniCPM</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>การไฟฟ้าส่วนภูมิภาค</div>
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>เลือก Workspace ที่ต้องการ</div>
      </div>

      <div style={{ padding: '16px' }}>
        {S.workspaces.map(w => {
          const allSums = w.projects.map(p => getPjSum(p));
          const tBudget = allSums.reduce((s, x) => s + x.allocUsable, 0);
          const tSpent = allSums.reduce((s, x) => s + x.paid, 0);
          const pct = tBudget > 0 ? Math.round(tSpent / tBudget * 100) : 0;
          return (
            <div key={w.id}
              onClick={() => update({ selectedWorkspaceId: w.id, mobileScreen: 'dashboard' })}
              style={{ background: C.white, borderRadius: '16px', padding: '18px', marginBottom: '12px', border: `1px solid ${C.line}`, boxShadow: '0 2px 12px rgba(107,63,160,0.06)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: `linear-gradient(180deg,${C.primary},${C.mid})`, borderRadius: '16px 0 0 16px' }} />
              <div style={{ paddingLeft: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: C.text }}>{w.name}</div>
                    <div style={{ fontSize: '11px', color: C.sub, marginTop: '2px' }}>{w.dept} • ปี {w.year}</div>
                  </div>
                  <div style={{ background: C.ghost, borderRadius: '20px', padding: '4px 12px' }}>
                    <span style={{ fontSize: '12px', color: C.primary, fontWeight: '700' }}>{w.projects.length} แฟ้ม</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ color: C.sub, fontSize: '10px' }}>เบิกจ่ายแล้ว</div>
                    <div style={{ color: C.text, fontSize: '14px', fontWeight: '700' }}>฿{fmt(tSpent)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: C.sub, fontSize: '10px' }}>งบรวม</div>
                    <div style={{ color: C.primary, fontSize: '14px', fontWeight: '700' }}>฿{fmt(w.totalBudget)}</div>
                  </div>
                </div>
                <div style={{ height: '5px', background: C.ghost, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: `linear-gradient(90deg,${C.primary},${C.mid})`, borderRadius: '3px' }} />
                </div>
                <div style={{ color: C.sub, fontSize: '10px', marginTop: '4px', textAlign: 'right' }}>{pct}% ใช้ไป</div>
              </div>
            </div>
          );
        })}

        <button
          onClick={() => update({ showModal: 'add-workspace', form: { ...S.form, wsName: '', wsYear: '2569', wsDept: 'กฟภ. สาขาย่อย เขต 1', wsBudget: '' } })}
          style={{ width: '100%', padding: '16px', background: 'none', border: `2px dashed ${C.pale}`, borderRadius: '16px', cursor: 'pointer', color: C.primary, fontSize: '14px', fontWeight: '600', fontFamily: "'SaoChingcha',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" /></svg>
          + สร้าง Workspace ใหม่
        </button>
      </div>
    </div>
  );
}

// ── Mobile Dashboard ───────────────────────────────────────────────────────

function MKpi({ label, value, unit, color, bg }: { label: string; value: string; unit: string; color: string; bg: string }) {
  return (
    <div style={{ background: bg, borderRadius: '14px', padding: '14px', border: `1px solid ${C.line}` }}>
      <div style={{ color: C.sub, fontSize: '11px', marginBottom: '6px' }}>{label}</div>
      <div style={{ color, fontSize: '20px', fontWeight: '700', lineHeight: '1.2' }}>{value}</div>
      <div style={{ color: C.sub, fontSize: '10px', marginTop: '3px' }}>{unit}</div>
    </div>
  );
}

function MobileDashboardScreen({ S, update, ws }: SharedProps) {
  if (!ws) return null;
  const pjs = ws.projects;
  const cnt = { active: 0, completed: 0, pending: 0, cancelled: 0 };
  pjs.forEach(p => { if (p.status in cnt) cnt[p.status as keyof typeof cnt]++; });
  const allSums = pjs.map(p => getPjSum(p));
  const tAlloc = allSums.reduce((s, x) => s + x.allocUsable, 0);
  const tSpent = allSums.reduce((s, x) => s + x.paid, 0);
  const tRem = allSums.reduce((s, x) => s + x.rem, 0);
  const pct = tAlloc > 0 ? Math.round(tSpent / tAlloc * 100) : 0;

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.paper }}>
      <div style={{ background: `linear-gradient(180deg,${C.sb},${C.sbMid})`, padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => update({ mobileScreen: 'workspace-list' })}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div>
            <div style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>{ws.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{ws.dept}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <MKpi label="แฟ้มงานทั้งหมด" value={String(pjs.length)} unit="โครงการ" color={C.primary} bg={C.white} />
          <MKpi label="กำลังดำเนิน" value={String(cnt.active)} unit="โครงการ" color={C.green} bg={C.greenBg} />
          <MKpi label="เบิกจ่ายแล้ว" value={`฿${fmt(tSpent)}`} unit={`${pct}%`} color={C.text} bg={C.white} />
          <MKpi label="งบคงเหลือ" value={`฿${fmt(tRem)}`} unit={`${100 - pct}%`} color={tRem >= 0 ? C.green : C.red} bg={tRem >= 0 ? C.greenBg : C.redBg} />
        </div>

        <div style={{ background: C.white, borderRadius: '16px', padding: '16px', marginBottom: '16px', border: `1px solid ${C.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: C.text }}>ความคืบหน้างบรวม</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: C.primary }}>{pct}%</div>
          </div>
          <div style={{ height: '8px', background: C.ghost, borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: `linear-gradient(90deg,${C.primary},${C.mid})`, borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '11px', color: C.sub }}>เบิกจ่าย ฿{fmt(tSpent)}</div>
            <div style={{ fontSize: '11px', color: C.sub }}>งบที่ใช้ได้ ฿{fmt(tAlloc)}</div>
          </div>
        </div>

        <div style={{ background: C.white, borderRadius: '16px', padding: '16px', marginBottom: '16px', border: `1px solid ${C.line}` }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: C.text, marginBottom: '12px' }}>สถานะโครงการ</div>
          {pjs.length > 0 && (
            <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px', gap: '2px' }}>
              {(Object.entries(statusCfg) as [string, { color: string }][]).map(([k, cfg]) => {
                const n = cnt[k as keyof typeof cnt] || 0;
                const p = n / pjs.length * 100;
                return p > 0 ? <div key={k} style={{ width: `${p}%`, background: cfg.color, borderRadius: '4px' }} /> : null;
              })}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {(Object.entries(statusCfg) as [string, { label: string; color: string; bg: string }][]).map(([k, cfg]) => (
              <div key={k} style={{ background: cfg.bg, borderRadius: '10px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: cfg.color, fontSize: '11px', fontWeight: '600' }}>{cfg.label}</span>
                <span style={{ color: cfg.color, fontSize: '16px', fontWeight: '700' }}>{cnt[k as keyof typeof cnt] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.line}`, overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: C.text }}>โครงการล่าสุด</div>
            <button onClick={() => update({ mobileScreen: 'projects' })} style={{ background: 'none', border: 'none', color: C.primary, fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>ดูทั้งหมด →</button>
          </div>
          {pjs.slice(0, 4).map((p, idx) => {
            const sc = statusCfg[p.status];
            const { paid, allocUsable: alloc } = getPjSum(p);
            const pp = alloc > 0 ? Math.round(paid / alloc * 100) : 0;
            return (
              <div key={p.id}
                onClick={() => update({ selectedProjectId: p.id, mobileScreen: 'project-detail', activeBudgetCat: 'all', activeBudgetStatus: 'all', selectedDivisionId: null })}
                style={{ padding: '12px 16px', borderBottom: idx < Math.min(pjs.length, 4) - 1 ? `1px solid ${C.line}` : 'none', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: C.text, flex: 1, marginRight: '8px', lineHeight: '1.3' }}>{p.name}</div>
                  <MBadge status={p.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: C.sub }}>฿{fmt(paid)} เบิกแล้ว</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ height: '4px', width: '60px', background: C.ghost, borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(pp, 100)}%`, height: '100%', background: sc.color, borderRadius: '2px' }} />
                    </div>
                    <span style={{ color: sc.color, fontSize: '10px', fontWeight: '700' }}>{pp}%</span>
                  </div>
                </div>
              </div>
            );
          })}
          {pjs.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: C.sub }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📂</div>
              <div style={{ fontSize: '13px' }}>ยังไม่มีโครงการ</div>
            </div>
          )}
        </div>

        <button
          onClick={() => update({ showModal: 'add-project', form: { ...S.form, pjName: '', pjApproval: '', pjControl: '', pjPhone: '', pjStart: '', pjRef: '', pjDiv: '', pjBudget: '' } })}
          style={{ width: '100%', padding: '14px', background: `linear-gradient(135deg,${C.deep},${C.primary})`, border: 'none', borderRadius: '14px', color: 'white', fontSize: '14px', fontWeight: '600', fontFamily: "'SaoChingcha',sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
          + สร้างแฟ้มงานใหม่
        </button>
      </div>
    </div>
  );
}

// ── Mobile ProjectList ─────────────────────────────────────────────────────

function MobileProjectListScreen({ S, update, ws }: SharedProps) {
  if (!ws) return null;
  const ft = S.filterStatus || 'all';
  const q = (S.searchQuery || '').toLowerCase();
  const filtered = ws.projects
    .filter(p => ft === 'all' || p.status === ft)
    .filter(p => !q || p.name.toLowerCase().includes(q) || p.controlPerson.toLowerCase().includes(q));

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.paper }}>
      <div style={{ background: C.white, borderBottom: `1px solid ${C.line}`, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: C.text }}>โครงการทั้งหมด</div>
            <div style={{ fontSize: '11px', color: C.sub }}>{ws.name} • {ws.projects.length} แฟ้มงาน</div>
          </div>
          <button
            onClick={() => update({ showModal: 'add-project', form: { ...S.form, pjName: '', pjApproval: '', pjControl: '', pjPhone: '', pjStart: '', pjRef: '', pjDiv: '', pjBudget: '' } })}
            style={{ background: `linear-gradient(135deg,${C.deep},${C.primary})`, border: 'none', color: 'white', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', fontFamily: "'SaoChingcha',sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
            สร้าง
          </button>
        </div>
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke={C.sub} strokeWidth="1.8" />
            <path d="M16.5 16.5L21 21" stroke={C.sub} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text" value={S.searchQuery || ''} onChange={e => update({ searchQuery: e.target.value })}
            placeholder="ค้นหาชื่องาน..."
            style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: '10px', border: `1.5px solid ${C.line}`, fontSize: '14px', fontFamily: "'SaoChingcha',sans-serif", color: C.text, background: C.paper, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {(['all', 'active', 'pending', 'completed', 'cancelled'] as const).map(t => {
            const labels = { all: 'ทั้งหมด', active: 'กำลังดำเนิน', pending: 'รอดำเนิน', completed: 'เสร็จแล้ว', cancelled: 'ยกเลิก' };
            const isA = ft === t;
            const sc = statusCfg[t as keyof typeof statusCfg];
            return (
              <button key={t} onClick={() => update({ filterStatus: t })}
                style={{ padding: '5px 14px', borderRadius: '20px', border: isA ? 'none' : `1px solid ${C.line}`, background: isA ? (sc ? sc.bg : C.ghost) : 'none', color: isA ? (sc ? sc.color : C.primary) : C.sub, fontSize: '12px', fontWeight: isA ? '700' : '400', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>
                {labels[t]}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.sub }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📂</div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>ไม่พบโครงการ</div>
          </div>
        ) : filtered.map(p => {
          const sc = statusCfg[p.status];
          const { paid, rem, allocUsable: alloc } = getPjSum(p);
          const pp = alloc > 0 ? Math.round(paid / alloc * 100) : 0;
          return (
            <div key={p.id}
              style={{ background: C.white, borderRadius: '14px', marginBottom: '10px', border: `1px solid ${C.line}`, boxShadow: '0 1px 8px rgba(107,63,160,0.05)', overflow: 'hidden' }}>
              {/* Card body — tap to open detail */}
              <div onClick={() => update({ selectedProjectId: p.id, mobileScreen: 'project-detail', activeBudgetCat: 'all', activeBudgetStatus: 'all', selectedDivisionId: null })}
                style={{ padding: '14px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ flex: 1, marginRight: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: C.text, lineHeight: '1.3', marginBottom: '3px' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: C.sub }}>{p.approvalNo} • แมก {p.division}</div>
                  </div>
                  <MBadge status={p.status} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ background: C.paper, borderRadius: '8px', padding: '8px 10px' }}>
                    <div style={{ color: C.sub, fontSize: '10px' }}>เบิกจ่าย</div>
                    <div style={{ color: C.text, fontSize: '13px', fontWeight: '700' }}>฿{fmt(paid)}</div>
                  </div>
                  <div style={{ background: rem >= 0 ? C.greenBg : C.redBg, borderRadius: '8px', padding: '8px 10px' }}>
                    <div style={{ color: C.sub, fontSize: '10px' }}>คงเหลือ</div>
                    <div style={{ color: rem >= 0 ? C.green : C.red, fontSize: '13px', fontWeight: '700' }}>฿{fmt(rem)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '5px', background: C.ghost, borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(pp, 100)}%`, height: '100%', background: sc.color, borderRadius: '3px' }} />
                  </div>
                  <span style={{ color: sc.color, fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{pp}%</span>
                  <span style={{ color: C.sub, fontSize: '10px', flexShrink: 0 }}>{p.controlPerson}</span>
                </div>
              </div>
              {/* Action bar */}
              <div style={{ display: 'flex', borderTop: `1px solid ${C.line}` }}>
                <button
                  onClick={() => update({ showModal: 'edit-project', editingProjectId: p.id, form: { ...S.form, pjName: p.name, pjApproval: p.approvalNo, pjControl: p.controlPerson, pjPhone: p.phone, pjStart: p.startDate, pjRef: p.budgetRef, pjDiv: p.division, pjBudget: String(p.totalBudget), pjStatus: p.status } })}
                  style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderRight: `1px solid ${C.line}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: C.primary, fontSize: '13px', fontWeight: '600', fontFamily: "'SaoChingcha',sans-serif" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  แก้ไข
                </button>
                <button
                  onClick={() => update({ showModal: 'delete-project', editingProjectId: p.id })}
                  style={{ flex: 1, padding: '10px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#ef4444', fontSize: '13px', fontWeight: '600', fontFamily: "'SaoChingcha',sans-serif" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  ลบ
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mobile ProjectDetail ───────────────────────────────────────────────────

function MobileProjectDetailScreen({ S, update, ws, pj, modPj }: SharedProps) {
  if (!pj || !ws) return null;

  const selDivId = S.selectedDivisionId;
  const filteredByCats = selDivId
    ? (pj.budgetCats || []).filter(c => c.divisionId === selDivId)
    : (pj.budgetCats || []);

  const divSums = filteredByCats.map(c => getCatSum(c));
  const tAllocTotal = divSums.reduce((s, x) => s + x.allocTotal, 0);
  const tAlloc = divSums.reduce((s, x) => s + x.allocUsable, 0);
  const tPaid = divSums.reduce((s, x) => s + x.paid, 0);
  const tRem = divSums.reduce((s, x) => s + x.rem, 0);
  const pct = tAlloc > 0 ? Math.round(tPaid / tAlloc * 100) : 0;

  const wCf = S.activeBudgetCat || 'all';
  const wCs = S.activeBudgetStatus || 'all';

  const shownCats = (pj.budgetCats || []).filter(c => {
    if (selDivId && c.divisionId !== selDivId) return false;
    if (wCf !== 'all' && c.cat !== wCf) return false;
    if (wCs !== 'all') {
      const s = getCatSum(c);
      if (wCs === 'unused') return s.paid === 0;
      if (wCs === 'inbudget') return s.paid > 0 && s.rem >= 0;
      if (wCs === 'over') return s.rem < 0;
    }
    return true;
  });

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.paper }}>
      <div style={{ background: `linear-gradient(180deg,${C.sb},${C.sbMid})`, padding: '14px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <button onClick={() => update({ mobileScreen: 'projects' })}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: '700', lineHeight: '1.3' }}>{pj.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginTop: '2px' }}>{pj.approvalNo}</div>
          </div>
          <MBadge status={pj.status} />
        </div>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* Info card */}
        <div style={{ background: C.white, borderRadius: '14px', padding: '14px', marginBottom: '12px', border: `1px solid ${C.line}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            {[['ผู้ควบคุมงาน', pj.controlPerson], ['วันเริ่มงาน', pj.startDate], ['แมก', pj.division], ['หมายเลขงาน', pj.budgetRef || '-']].map(([l, v]) => (
              <div key={l}>
                <div style={{ color: C.sub, fontSize: '10px', marginBottom: '2px' }}>{l}</div>
                <div style={{ color: C.text, fontSize: '12px', fontWeight: '600' }}>{v || '-'}</div>
              </div>
            ))}
          </div>

          {/* Division chips */}
          <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: '10px', marginBottom: '10px' }}>
            <div style={{ color: C.sub, fontSize: '10px', fontWeight: '700', marginBottom: '7px' }}>รหัสแผนก</div>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              <button
                onClick={() => update({ selectedDivisionId: null })}
                style={{ padding: '5px 12px', borderRadius: '20px', border: selDivId === null ? `2px solid ${C.primary}` : `1px solid ${C.line}`, background: selDivId === null ? `linear-gradient(135deg,${C.deep},${C.primary})` : 'none', color: selDivId === null ? 'white' : C.sub, fontSize: '12px', fontWeight: selDivId === null ? '700' : '400', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif", flexShrink: 0 }}>
                ทั้งหมด
              </button>
              {(pj.divisions || []).map(div => {
                const isAct = selDivId === div.id;
                return (
                  <div key={div.id} style={{ display: 'inline-flex', alignItems: 'center', border: isAct ? `2px solid ${C.primary}` : `1px solid ${C.pale}`, borderRadius: '20px', background: isAct ? C.ghost : 'none', overflow: 'hidden', flexShrink: 0 }}>
                    <button
                      onClick={() => update({ selectedDivisionId: isAct ? null : div.id })}
                      style={{ padding: '5px 10px 5px 12px', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: "'SaoChingcha',sans-serif" }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isAct ? C.primary : C.sub, flexShrink: 0 }} />
                      <span style={{ color: isAct ? C.primary : C.text, fontSize: '12px', fontWeight: isAct ? '700' : '500' }}>{div.code}</span>
                    </button>
                    <button
                      onClick={() => update({ showModal: 'view-division', viewingDivId: div.id })}
                      style={{ padding: '5px 8px 5px 4px', background: 'none', border: 'none', borderLeft: `1px solid ${isAct ? C.pale : C.line}`, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', color: C.sub }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L17 7M17 7H7M17 7v10" stroke={C.sub} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => update({ showModal: 'add-division', editingDivId: null, form: { ...S.form, divCode: '', divNetworkCode: '', divDesc: '' } })}
                style={{ padding: '5px 10px', border: `1.5px dashed ${C.pale}`, borderRadius: '20px', background: 'none', color: C.sub, fontSize: '11px', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif", flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={C.sub} strokeWidth="2.5" strokeLinecap="round" /></svg>
                + แผนก
              </button>
            </div>
          </div>

          {/* Budget summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            {([['งบจัดสรรรวม', fmt(tAllocTotal), C.text], ['งบที่ใช้ได้', fmt(tAlloc), C.primary], ['รวมเบิกจ่าย', fmt(tPaid), C.text], ['คงเหลือ', fmt(tRem), tRem >= 0 ? C.green : C.red]] as [string, string, string][]).map(([l, v, col]) => (
              <div key={l} style={{ background: C.paper, borderRadius: '10px', padding: '10px 12px' }}>
                <div style={{ color: C.sub, fontSize: '10px', marginBottom: '2px' }}>{l}</div>
                <div style={{ color: col, fontSize: '14px', fontWeight: '700' }}>฿{v}</div>
              </div>
            ))}
          </div>
          <div style={{ height: '6px', background: C.ghost, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: `linear-gradient(90deg,${C.primary},${C.mid})`, borderRadius: '3px' }} />
          </div>
          <div style={{ color: C.sub, fontSize: '10px', marginTop: '4px', textAlign: 'right' }}>{pct}% เบิกจ่ายแล้ว</div>
        </div>

        {/* Budget cats section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: C.text }}>ทะเบียนลงคุมงบ</div>
          <button
            onClick={() => update({ showModal: 'add-budget-cat', editingCatId: null, form: { ...S.form, bcName: '', bcCat: 'labor', bcAllocTotal: '', bcUsagePct: 100 } })}
            style={{ background: `linear-gradient(135deg,${C.deep},${C.primary})`, border: 'none', color: 'white', padding: '7px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', fontFamily: "'SaoChingcha',sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
            + เพิ่มประเภทงบ
          </button>
        </div>

        {/* Filters */}
        <div style={{ background: C.white, borderRadius: '12px', padding: '10px 12px', marginBottom: '10px', border: `1px solid ${C.line}` }}>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '6px' }}>
            {(['all', 'labor', 'supervision', 'transport', 'misc'] as const).map(cat => {
              const labels: Record<string, string> = { all: 'ทั้งหมด', labor: 'ค่าแรง', supervision: 'ค่าควบคุม', transport: 'ค่าขนส่ง', misc: 'เบ็ดเตล็ด' };
              const isA = wCf === cat;
              const cfg = catCfg[cat as CatKey];
              return (
                <button key={cat} onClick={() => update({ activeBudgetCat: cat })}
                  style={{ padding: '4px 10px', borderRadius: '20px', border: isA ? 'none' : `1px solid ${C.line}`, background: isA ? (cfg ? cfg.bg : C.ghost) : 'none', color: isA ? (cfg ? cfg.color : C.primary) : C.sub, fontSize: '11px', fontWeight: isA ? '700' : '400', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif", whiteSpace: 'nowrap' }}>
                  {labels[cat]}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {(['all', 'unused', 'inbudget', 'over'] as const).map(st => {
              const sCfg = { all: { label: 'ทั้งหมด', color: C.primary, bg: C.ghost }, unused: { label: 'ยังไม่เบิก', color: C.sub, bg: '#F0EDF8' }, inbudget: { label: 'ในงบ ✓', color: C.green, bg: C.greenBg }, over: { label: 'เกินงบ ⚠', color: C.red, bg: C.redBg } };
              const isA = wCs === st;
              const cfg2 = sCfg[st];
              return (
                <button key={st} onClick={() => update({ activeBudgetStatus: st })}
                  style={{ padding: '4px 10px', borderRadius: '20px', border: isA ? 'none' : `1px solid ${C.line}`, background: isA ? cfg2.bg : 'none', color: isA ? cfg2.color : C.sub, fontSize: '11px', fontWeight: isA ? '700' : '400', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif", whiteSpace: 'nowrap' }}>
                  {cfg2.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget category cards */}
        {shownCats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: C.sub }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📋</div>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              {(pj.budgetCats || []).length === 0 ? 'ยังไม่มีประเภทงบ' : 'ไม่พบตามตัวกรอง'}
            </div>
            <div style={{ fontSize: '12px' }}>
              {(pj.budgetCats || []).length === 0 ? 'กด "+ เพิ่มประเภทงบ" เพื่อเริ่มต้น' : 'ลองเปลี่ยนตัวกรองด้านบน'}
            </div>
          </div>
        ) : shownCats.map(cat => {
          const cfg = catCfg[cat.cat] || { label: cat.cat, color: C.primary, bg: C.ghost };
          const { allocUsable, paid, rem } = getCatSum(cat);
          const sp = allocUsable > 0 ? Math.round(paid / allocUsable * 100) : 0;
          const isCollapsed = !!S.collapsedCats[cat.id];

          return (
            <div key={cat.id} style={{ background: C.white, borderRadius: '14px', marginBottom: '10px', border: `1px solid ${C.line}`, overflow: 'hidden' }}>
              <div
                onClick={() => update({ collapsedCats: { ...S.collapsedCats, [cat.id]: !S.collapsedCats[cat.id] } })}
                style={{ background: cfg.bg, padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <div style={{ width: '3px', height: '36px', background: cfg.color, borderRadius: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: C.text }}>{cat.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span style={{ background: 'white', color: cfg.color, fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>{cfg.label}</span>
                        <span style={{ color: cfg.color, fontSize: '10px' }}>{(cat.transactions || []).length} รายการ</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <button onClick={e => { e.stopPropagation(); update({ showModal: 'add-budget-cat', editingCatId: cat.id, form: { ...S.form, bcName: cat.name, bcCat: cat.cat, bcAllocTotal: String(cat.allocTotal), bcUsagePct: cat.usagePct } }); }}
                      style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M16.86 4.14a2 2 0 0 1 2.83 2.83L7.5 19.16l-4 1 1-4L16.86 4.14z" stroke={C.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button onClick={e => { e.stopPropagation(); modPj(p => ({ ...p, budgetCats: p.budgetCats.filter(c => c.id !== cat.id) })); }}
                      style={{ width: '28px', height: '28px', borderRadius: '8px', background: C.redBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.18s ease' }}>
                      <path d="M6 9l6 6 6-6" stroke={cfg.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                  <div>
                    <div style={{ color: C.sub, fontSize: '9px' }}>งบจัดสรร</div>
                    <div style={{ color: C.text, fontSize: '12px', fontWeight: '700' }}>฿{fmt(cat.allocTotal)}</div>
                  </div>
                  <div>
                    <div style={{ color: C.sub, fontSize: '9px' }}>เบิกจ่าย</div>
                    <div style={{ color: C.text, fontSize: '12px', fontWeight: '700' }}>฿{fmt(paid)}</div>
                  </div>
                  <div>
                    <div style={{ color: C.sub, fontSize: '9px' }}>คงเหลือ</div>
                    <div style={{ color: rem >= 0 ? C.green : C.red, fontSize: '12px', fontWeight: '700' }}>฿{fmt(rem)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.07)', borderRadius: '8px', padding: '2px', gap: '1px' }}>
                    {[80, 100].map(pv => {
                      const isAct = cat.usagePct === pv;
                      return (
                        <button key={pv}
                          onClick={e => { e.stopPropagation(); modPj(p => ({ ...p, budgetCats: p.budgetCats.map(c => c.id === cat.id ? { ...c, usagePct: pv } : c) })); }}
                          style={{ padding: '2px 8px', borderRadius: '6px', border: 'none', background: isAct ? cfg.color : 'transparent', color: isAct ? 'white' : C.sub, fontSize: '10px', fontWeight: '700', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>
                          {pv}%
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ flex: 1, height: '5px', background: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(sp, 100)}%`, height: '100%', background: cfg.color, borderRadius: '3px' }} />
                  </div>
                  <span style={{ color: cfg.color, fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{sp}%</span>
                </div>
              </div>

              {!isCollapsed && (
                <div style={{ background: C.white }}>
                  {(cat.transactions || []).map(tx => (
                    <div key={tx.id} style={{ padding: '10px 14px', borderBottom: `1px solid ${C.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '13px', color: C.text }}>{tx.desc}</div>
                          <div style={{ fontSize: '10px', color: C.sub }}>{tx.date}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: C.text }}>฿{fmt(tx.amount)}</div>
                        <button onClick={() => update({ showModal: 'add-transaction', editingTxId: tx.id, targetCatId: cat.id, form: { ...S.form, txDesc: tx.desc, txAmount: String(tx.amount), txDate: tx.date || '' } })}
                          style={{ width: '26px', height: '26px', borderRadius: '7px', background: C.ghost, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M16.86 4.14a2 2 0 0 1 2.83 2.83L7.5 19.16l-4 1 1-4L16.86 4.14z" stroke={C.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        <button onClick={() => modPj(p => ({ ...p, budgetCats: p.budgetCats.map(c => c.id === cat.id ? { ...c, transactions: c.transactions.filter(t => t.id !== tx.id) } : c) }))}
                          style={{ width: '26px', height: '26px', borderRadius: '7px', background: C.redBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '10px 14px' }}>
                    <button onClick={() => update({ showModal: 'add-transaction', editingTxId: null, targetCatId: cat.id, form: { ...S.form, txDesc: '', txAmount: '', txDate: '' } })}
                      style={{ background: 'none', border: `1.5px dashed ${cfg.color}70`, borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: cfg.color, fontSize: '12px', fontWeight: '600', fontFamily: "'SaoChingcha',sans-serif", display: 'flex', alignItems: 'center', gap: '5px', width: '100%', justifyContent: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round" /></svg>
                      + เพิ่มรายการเบิกจ่าย ({cfg.label})
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Bottom Sheets ──────────────────────────────────────────────────────────

function MobileSheets(props: SharedProps) {
  const { S } = props;
  if (!S.showModal) return null;
  return (
    <>
      {S.showModal === 'add-workspace' && <AddWsSheet {...props} />}
      {S.showModal === 'add-project' && <AddPjSheet {...props} />}
      {S.showModal === 'add-budget-cat' && <AddBudgetCatSheet {...props} />}
      {S.showModal === 'add-transaction' && <AddTxSheet {...props} />}
      {S.showModal === 'add-division' && <AddDivSheet {...props} />}
      {S.showModal === 'view-division' && <ViewDivSheet {...props} />}
    </>
  );
}

function AddWsSheet({ S, update, closeModal }: SharedProps) {
  const f = S.form;
  return (
    <SheetBackdrop onClose={closeModal}>
      <div style={{ padding: '20px 20px 32px' }}>
        <SheetHandle />
        <div style={{ fontSize: '16px', fontWeight: '700', color: C.text, marginBottom: '20px' }}>สร้าง Workspace ใหม่</div>
        <SInp label="ชื่อ Workspace" value={f.wsName} onChange={e => update({ form: { ...f, wsName: e.target.value } })} placeholder="เช่น งบประมาณ 2569" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <SInp label="ปีงบประมาณ (พ.ศ.)" type="number" value={f.wsYear} onChange={e => update({ form: { ...f, wsYear: e.target.value } })} placeholder="2569" />
          <SInp label="งบประมาณรวม (บาท)" type="number" value={f.wsBudget} onChange={e => update({ form: { ...f, wsBudget: e.target.value } })} placeholder="0" />
        </div>
        <SInp label="หน่วยงาน" value={f.wsDept} onChange={e => update({ form: { ...f, wsDept: e.target.value } })} placeholder="กฟภ. สาขาย่อย เขต 1" />
        <SBtn label="สร้าง Workspace" onClick={() => {
          if (!f.wsName) return;
          const nw = { id: Date.now(), name: f.wsName, year: parseInt(f.wsYear) || 2568, dept: f.wsDept || 'กฟภ.', totalBudget: parseFloat(f.wsBudget) || 0, projects: [] };
          update({ workspaces: [...S.workspaces, nw], showModal: null, selectedWorkspaceId: nw.id, mobileScreen: 'dashboard' });
        }} />
      </div>
    </SheetBackdrop>
  );
}

function AddPjSheet({ S, update, closeModal }: SharedProps) {
  const f = S.form;
  return (
    <SheetBackdrop onClose={closeModal}>
      <div style={{ padding: '20px 20px 32px' }}>
        <SheetHandle />
        <div style={{ fontSize: '16px', fontWeight: '700', color: C.text, marginBottom: '20px' }}>สร้างแฟ้มงานใหม่</div>
        <SInp label="ชื่องาน" value={f.pjName} onChange={e => update({ form: { ...f, pjName: e.target.value } })} placeholder="เช่น งาน กฟร.99 สาย 6" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <SInp label="เลขที่อนุมัติ" value={f.pjApproval} onChange={e => update({ form: { ...f, pjApproval: e.target.value } })} placeholder="เช่น ศก(333) 66/69" />
          <SInp label="วันที่เริ่มงาน" value={f.pjStart} onChange={e => update({ form: { ...f, pjStart: e.target.value } })} placeholder="01 มิ.ย. 69" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <SInp label="ผู้ควบคุมงาน" value={f.pjControl} onChange={e => update({ form: { ...f, pjControl: e.target.value } })} placeholder="ชื่อ-นามสกุล" />
          <SInp label="เบอร์โทรติดต่อ" type="tel" value={f.pjPhone} onChange={e => update({ form: { ...f, pjPhone: e.target.value } })} placeholder="08X-XXX-XXXX" />
        </div>
        <SInp label="หมายเลขงาน / หนังสืออ้างอิง" value={f.pjRef} onChange={e => update({ form: { ...f, pjRef: e.target.value } })} placeholder="C-69-B-TAK-CS-7009" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <SInp label="แผนก / แมก" value={f.pjDiv} onChange={e => update({ form: { ...f, pjDiv: e.target.value } })} placeholder="เช่น 103ช่" />
          <SInp label="งบประมาณรวม (บาท)" type="number" value={f.pjBudget} onChange={e => update({ form: { ...f, pjBudget: e.target.value } })} placeholder="0" />
        </div>
        <SBtn label="สร้างแฟ้มงาน" onClick={() => {
          if (!f.pjName) return;
          const np = { id: Date.now(), name: f.pjName, approvalNo: f.pjApproval || '', controlPerson: f.pjControl || '', phone: f.pjPhone || '', startDate: f.pjStart || '', budgetRef: f.pjRef || '', division: f.pjDiv || '', status: 'pending' as const, totalBudget: parseFloat(f.pjBudget) || 0, budgetCats: [] };
          update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: [...w.projects, np] } : w), showModal: null });
        }} />
      </div>
    </SheetBackdrop>
  );
}

function AddBudgetCatSheet({ S, update, closeModal, pj }: SharedProps) {
  const f = S.form;
  const isEdit = S.editingCatId !== null;
  const alloc = parseFloat(f.bcAllocTotal) || 0;
  const divs = pj?.divisions || [];
  return (
    <SheetBackdrop onClose={closeModal}>
      <div style={{ padding: '20px 20px 32px' }}>
        <SheetHandle />
        <div style={{ fontSize: '16px', fontWeight: '700', color: C.text, marginBottom: '20px' }}>{isEdit ? 'แก้ไขประเภทงบ' : 'เพิ่มประเภทงบใหม่'}</div>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ color: C.sub, fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>ประเภท</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {(Object.entries(catCfg) as [string, { label: string; color: string; bg: string }][]).map(([k, cfg]) => {
              const sel = (f.bcCat || 'labor') === k;
              return (
                <button key={k} onClick={() => update({ form: { ...f, bcCat: k as CatKey } })}
                  style={{ padding: '10px 8px', borderRadius: '10px', cursor: 'pointer', border: sel ? `2px solid ${cfg.color}` : `1.5px solid ${C.line}`, background: sel ? cfg.bg : C.white, color: sel ? cfg.color : C.sub, fontSize: '13px', fontWeight: '600', fontFamily: "'SaoChingcha',sans-serif" }}>
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
        <SInp label="งบจัดสรรรวม (บาท)" type="number" value={f.bcAllocTotal} onChange={e => update({ form: { ...f, bcAllocTotal: e.target.value } })} placeholder="0" />
        <div style={{ marginBottom: '14px' }}>
          <div style={{ color: C.sub, fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>สัดส่วนการใช้งบ</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[80, 100].map(pv => {
              const isSel = (f.bcUsagePct || 100) === pv;
              const effAmt = Math.round(alloc * pv / 100);
              return (
                <button key={pv} onClick={() => update({ form: { ...f, bcUsagePct: pv } })}
                  style={{ padding: '12px 8px', borderRadius: '12px', cursor: 'pointer', border: isSel ? `2px solid ${C.primary}` : `1.5px solid ${C.line}`, background: isSel ? C.ghost : C.white, fontFamily: "'SaoChingcha',sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ color: isSel ? C.primary : C.sub, fontSize: '20px', fontWeight: '700' }}>{pv}%</div>
                  <div style={{ color: C.sub, fontSize: '11px' }}>ใช้ได้ ฿{fmt(effAmt)}</div>
                  {isSel && <div style={{ fontSize: '10px', color: C.primary, fontWeight: '600' }}>{pv === 80 ? '🛡️ สำรอง 20%' : '✅ เต็มจำนวน'}</div>}
                </button>
              );
            })}
          </div>
        </div>
        {divs.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ color: C.sub, fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>เชื่อมโยงกับแผนก (ไม่บังคับ)</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button onClick={() => update({ form: { ...f, bcDivisionId: null } })}
                style={{ padding: '5px 12px', borderRadius: '20px', border: f.bcDivisionId == null ? `2px solid ${C.primary}` : `1px solid ${C.line}`, background: f.bcDivisionId == null ? C.ghost : 'none', color: f.bcDivisionId == null ? C.primary : C.sub, fontSize: '12px', fontWeight: f.bcDivisionId == null ? '700' : '400', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>
                ไม่ระบุ
              </button>
              {divs.map(div => (
                <button key={div.id} onClick={() => update({ form: { ...f, bcDivisionId: div.id } })}
                  style={{ padding: '5px 12px', borderRadius: '20px', border: f.bcDivisionId === div.id ? `2px solid ${C.primary}` : `1px solid ${C.line}`, background: f.bcDivisionId === div.id ? C.ghost : 'none', color: f.bcDivisionId === div.id ? C.primary : C.sub, fontSize: '12px', fontWeight: f.bcDivisionId === div.id ? '700' : '400', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>
                  {div.code}
                </button>
              ))}
            </div>
          </div>
        )}
        <SBtn label={isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มประเภทงบ'} onClick={() => {
          const autoName = (catCfg[f.bcCat] || { label: f.bcCat }).label;
          const saveName = f.bcName || autoName;
          if (isEdit) {
            update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? { ...p, budgetCats: p.budgetCats.map(c => c.id === S.editingCatId ? { ...c, name: saveName, cat: f.bcCat, allocTotal: parseFloat(f.bcAllocTotal) || 0, usagePct: f.bcUsagePct || 100, divisionId: f.bcDivisionId || null } : c) } : p) } : w), showModal: null, editingCatId: null });
          } else {
            const nc = { id: Date.now(), cat: f.bcCat, name: saveName, allocTotal: parseFloat(f.bcAllocTotal) || 0, usagePct: f.bcUsagePct || 100, divisionId: f.bcDivisionId || null, transactions: [] };
            update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? { ...p, budgetCats: [...(p.budgetCats || []), nc] } : p) } : w), showModal: null });
          }
        }} />
      </div>
    </SheetBackdrop>
  );
}

function AddTxSheet({ S, update, closeModal, pj }: SharedProps) {
  const f = S.form;
  const isEdit = S.editingTxId !== null;
  const cat = pj ? (pj.budgetCats || []).find(c => c.id === S.targetCatId) : null;
  const cfg = cat ? catCfg[cat.cat] : null;
  const catS = cat ? getCatSum(cat) : null;
  const amt = parseFloat(f.txAmount) || 0;
  const prevAmt = isEdit && cat ? ((cat.transactions || []).find(t => t.id === S.editingTxId) || { amount: 0 }).amount : 0;
  const newRem = catS ? catS.allocUsable - (catS.paid - prevAmt + amt) : 0;
  return (
    <SheetBackdrop onClose={closeModal}>
      <div style={{ padding: '20px 20px 32px' }}>
        <SheetHandle />
        <div style={{ fontSize: '16px', fontWeight: '700', color: C.text, marginBottom: '16px' }}>{isEdit ? 'แก้ไขรายการ' : 'เพิ่มรายการเบิกจ่าย'}</div>
        {cat && cfg && (
          <div style={{ background: cfg.bg, borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: cfg.color, fontSize: '12px', fontWeight: '700' }}>{cat.name}</span>
            <span style={{ color: C.sub, fontSize: '11px' }}>คงเหลือ: ฿{fmt(catS!.rem)}</span>
          </div>
        )}
        <SInp label="ชื่อรายการ / หมายเหตุ" value={f.txDesc} onChange={e => update({ form: { ...f, txDesc: e.target.value } })} placeholder="เช่น เบิกค่าแรง งวด 1" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <SInp label="จำนวนเงิน (บาท)" type="number" value={f.txAmount} onChange={e => update({ form: { ...f, txAmount: e.target.value } })} placeholder="0" />
          <SInp label="วันที่เบิกจ่าย" value={f.txDate} onChange={e => update({ form: { ...f, txDate: e.target.value } })} placeholder="25 มิ.ย. 69" />
        </div>
        {amt > 0 && (
          <div style={{ background: newRem >= 0 ? C.greenBg : C.redBg, borderRadius: '12px', padding: '12px 14px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: C.sub, fontSize: '11px', marginBottom: '2px' }}>คงเหลือหลังเบิก</div>
              <div style={{ color: newRem >= 0 ? C.green : C.red, fontSize: '20px', fontWeight: '700' }}>฿{fmt(newRem)}</div>
            </div>
            <div style={{ fontSize: '24px' }}>{newRem >= 0 ? '✅' : '⚠️'}</div>
          </div>
        )}
        <SBtn label={isEdit ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'} onClick={() => {
          if (!f.txDesc || !f.txAmount) return;
          const nt = { id: isEdit ? S.editingTxId! : Date.now(), desc: f.txDesc, amount: parseFloat(f.txAmount) || 0, date: f.txDate || '' };
          update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? { ...p, budgetCats: p.budgetCats.map(c => c.id === S.targetCatId ? { ...c, transactions: isEdit ? c.transactions.map(t => t.id === S.editingTxId ? nt : t) : [...(c.transactions || []), nt] } : c) } : p) } : w), showModal: null, editingTxId: null, targetCatId: null });
        }} />
      </div>
    </SheetBackdrop>
  );
}

function AddDivSheet({ S, update, closeModal }: SharedProps) {
  const f = S.form;
  const isEdit = S.editingDivId !== null;
  return (
    <SheetBackdrop onClose={closeModal}>
      <div style={{ padding: '20px 20px 32px' }}>
        <SheetHandle />
        <div style={{ fontSize: '16px', fontWeight: '700', color: C.text, marginBottom: '20px' }}>{isEdit ? 'แก้ไขรหัสแผนก' : 'เพิ่มรหัสแผนก'}</div>
        <SInp label="รหัสแผนก" value={f.divCode} onChange={e => update({ form: { ...f, divCode: e.target.value } })} placeholder="เช่น HT-C-E" />
        <SInp label="รหัสเครือข่าย" value={f.divNetworkCode} onChange={e => update({ form: { ...f, divNetworkCode: e.target.value } })} placeholder="เช่น 8005204585" />
        <SInp label="คำอธิบาย (ไม่บังคับ)" value={f.divDesc} onChange={e => update({ form: { ...f, divDesc: e.target.value } })} placeholder="เช่น แรงสูง-โยธา-ไฟฟ้า" />
        <SBtn label={isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มรหัสแผนก'} onClick={() => {
          if (!f.divCode) return;
          const nd = { id: isEdit ? S.editingDivId! : Date.now(), code: f.divCode, networkCode: f.divNetworkCode || '', desc: f.divDesc || '' };
          update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? { ...p, divisions: isEdit ? (p.divisions || []).map(d => d.id === S.editingDivId ? nd : d) : [...(p.divisions || []), nd] } : p) } : w), showModal: null, editingDivId: null });
        }} />
      </div>
    </SheetBackdrop>
  );
}

function ViewDivSheet({ S, update, closeModal, pj }: SharedProps) {
  if (!pj) return null;
  const div = (pj.divisions || []).find(d => d.id === S.viewingDivId);
  if (!div) return null;
  const linkedCats = (pj.budgetCats || []).filter(c => c.divisionId === div.id);
  const sums = linkedCats.map(c => getCatSum(c));
  const tA = sums.reduce((s, x) => s + x.allocUsable, 0);
  const tP = sums.reduce((s, x) => s + x.paid, 0);
  const tR = sums.reduce((s, x) => s + x.rem, 0);
  return (
    <SheetBackdrop onClose={closeModal}>
      <div style={{ padding: '20px 20px 32px' }}>
        <SheetHandle />
        <div style={{ fontSize: '16px', fontWeight: '700', color: C.text, marginBottom: '16px' }}>รายละเอียดแผนก</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <div style={{ background: C.ghost, borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ color: C.sub, fontSize: '11px', marginBottom: '3px' }}>รหัสแผนก</div>
            <div style={{ color: C.primary, fontSize: '20px', fontWeight: '700' }}>{div.code}</div>
          </div>
          <div style={{ background: C.ghost, borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ color: C.sub, fontSize: '11px', marginBottom: '3px' }}>รหัสเครือข่าย</div>
            <div style={{ color: C.text, fontSize: '20px', fontWeight: '700' }}>{div.networkCode || '-'}</div>
          </div>
        </div>
        {div.desc && <div style={{ color: C.sub, fontSize: '12px', marginBottom: '14px', background: C.paper, borderRadius: '10px', padding: '10px 14px' }}>{div.desc}</div>}
        {linkedCats.length > 0 && (
          <div style={{ background: C.ghost, borderRadius: '12px', padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
            <div><div style={{ color: C.sub, fontSize: '10px', marginBottom: '2px' }}>งบที่ใช้ได้</div><div style={{ color: C.primary, fontSize: '13px', fontWeight: '700' }}>฿{fmt(tA)}</div></div>
            <div><div style={{ color: C.sub, fontSize: '10px', marginBottom: '2px' }}>เบิกจ่าย</div><div style={{ color: C.text, fontSize: '13px', fontWeight: '700' }}>฿{fmt(tP)}</div></div>
            <div><div style={{ color: C.sub, fontSize: '10px', marginBottom: '2px' }}>คงเหลือ</div><div style={{ color: tR >= 0 ? C.green : C.red, fontSize: '13px', fontWeight: '700' }}>฿{fmt(tR)}</div></div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => update({ showModal: 'add-division', editingDivId: div.id, viewingDivId: null, form: { ...S.form, divCode: div.code, divNetworkCode: div.networkCode || '', divDesc: div.desc || '' } })}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', background: C.ghost, border: 'none', color: C.primary, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>
            ✏️ แก้ไข
          </button>
          <button onClick={() => {
            update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? { ...p, divisions: (p.divisions || []).filter(d => d.id !== div.id) } : p) } : w), showModal: null, viewingDivId: null });
          }} style={{ padding: '12px 16px', borderRadius: '12px', background: C.redBg, border: 'none', color: C.red, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>
            🗑️ ลบ
          </button>
        </div>
      </div>
    </SheetBackdrop>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────

export default function MobileApp(props: SharedProps) {
  const { S, update } = props;
  const screen = S.mobileScreen;
  const showBottomNav = screen === 'dashboard' || screen === 'projects';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'SaoChingcha', sans-serif", overflow: 'hidden', background: C.paper }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {screen === 'workspace-list' && <WorkspaceListScreen {...props} />}
        {screen === 'dashboard' && <MobileDashboardScreen {...props} />}
        {screen === 'projects' && <MobileProjectListScreen {...props} />}
        {screen === 'project-detail' && <MobileProjectDetailScreen {...props} />}
      </div>
      {showBottomNav && (
        <BottomNav screen={screen} onNav={s => update({ mobileScreen: s })} />
      )}
      <MobileSheets {...props} />
    </div>
  );
}
