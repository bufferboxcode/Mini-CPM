'use client';
import { C, statusCfg, catCfg } from '@/lib/constants';
import { getCatSum, getPjSum, fmt } from '@/lib/utils';
import { TopBar, PrimaryBtn, Badge } from '@/components/ui';
import type { SharedProps } from '@/components/PeaApp';

export default function DashboardView({ S, update, ws }: SharedProps) {
  if (!ws) return null;
  const pjs = ws.projects;
  const cnt = { active: 0, completed: 0, pending: 0, cancelled: 0 };
  pjs.forEach(p => { if (p.status in cnt) cnt[p.status as keyof typeof cnt]++; });
  const allSums = pjs.map(p => getPjSum(p));
  const tAlloc = allSums.reduce((s, x) => s + x.allocUsable, 0);
  const tSpent = allSums.reduce((s, x) => s + x.paid, 0);
  const tRem = allSums.reduce((s, x) => s + x.rem, 0);
  const pct = tAlloc > 0 ? Math.round(tSpent / tAlloc * 100) : 0;
  const catT = { labor: 0, supervision: 0, transport: 0, misc: 0 };
  pjs.flatMap(p => p.budgetCats || []).forEach(c => {
    if (c.cat in catT) catT[c.cat as keyof typeof catT] += getCatSum(c).allocUsable;
  });
  const catSum = Object.values(catT).reduce((s, v) => s + v, 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar
        title={`ภาพรวม — ${ws.name}`}
        sub={`${ws.dept} • ปี ${ws.year}`}
        actions={
          <PrimaryBtn label="สร้างแฟ้มงาน" onClick={() => update({ showModal: 'add-project', form: { ...S.form, pjName: '', pjApproval: '', pjControl: '', pjPhone: '', pjStart: '', pjRef: '', pjDiv: '', pjBudget: '' } })} />
        }
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '22px' }}>
          <KpiCard bg={C.white} label="แฟ้มงานทั้งหมด" value={String(pjs.length)} valueColor={C.primary} sub="โครงการ" icoBg={C.ghost}
            ico={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="2" fill={C.primary} /><rect x="13" y="3" width="8" height="8" rx="2" fill={C.primary} opacity="0.5" /><rect x="3" y="13" width="8" height="8" rx="2" fill={C.primary} opacity="0.5" /><rect x="13" y="13" width="8" height="8" rx="2" fill={C.primary} /></svg>}
          />
          <KpiCard bg={C.greenBg} label="กำลังดำเนินการ" value={String(cnt.active)} valueColor={C.green} sub="โครงการ" icoBg="rgba(45,184,122,0.15)"
            ico={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.green} strokeWidth="1.8" fill="none" /><path d="M8 12l3 3 5-5" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          />
          <KpiCard bg={C.white} label="เบิกจ่ายทั้งหมด" value={`฿${fmt(tSpent)}`} valueColor={C.text} sub={`จากงบ ฿${fmt(tAlloc)}`} icoBg={C.ghost}
            ico={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="3" stroke={C.primary} strokeWidth="1.8" fill="none" /><path d="M2 10h20" stroke={C.primary} strokeWidth="1.8" /><circle cx="7" cy="15" r="1.5" fill={C.primary} /></svg>}
          />
          <KpiCard bg={C.orangeBg} label="งบคงเหลือรวม" value={`฿${fmt(tRem)}`} valueColor={C.orange} sub={`${100 - pct}% ของงบจัดสรร`} icoBg="rgba(217,123,34,0.12)"
            ico={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v10" stroke={C.orange} strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="17" r="2" fill={C.orange} /><path d="M4.5 20.5h15" stroke={C.orange} strokeWidth="2" strokeLinecap="round" /></svg>}
          />
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
          {/* Status chart */}
          <div style={{ background: C.white, borderRadius: '16px', padding: '22px', border: `1px solid ${C.line}`, boxShadow: '0 2px 12px rgba(107,63,160,0.06)' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: C.text, marginBottom: '16px' }}>สถานะโครงการ</div>
            {pjs.length > 0 && (
              <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '18px', gap: '2px' }}>
                {(Object.entries(statusCfg) as [string, { color: string }][]).map(([k, cfg]) => {
                  const n = cnt[k as keyof typeof cnt] || 0;
                  const p = n / pjs.length * 100;
                  return p > 0 ? <div key={k} style={{ width: `${p}%`, background: cfg.color, borderRadius: '5px' }} /> : null;
                })}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {(Object.entries(statusCfg) as [string, { label: string; color: string }][]).map(([k, cfg]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: C.text, fontSize: '13px' }}>{cfg.label}</span>
                  <div style={{ height: '5px', width: '90px', background: C.ghost, borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: pjs.length > 0 ? `${(cnt[k as keyof typeof cnt] || 0) / pjs.length * 100}%` : '0%', height: '100%', background: cfg.color, borderRadius: '3px' }} />
                  </div>
                  <span style={{ color: cfg.color, fontSize: '14px', fontWeight: '700', width: '20px', textAlign: 'right' }}>{cnt[k as keyof typeof cnt] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Budget by type */}
          {catSum > 0 ? (
            <div style={{ background: C.white, borderRadius: '16px', padding: '22px', border: `1px solid ${C.line}`, boxShadow: '0 2px 12px rgba(107,63,160,0.06)' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: C.text, marginBottom: '16px' }}>งบตามประเภทรายจ่าย</div>
              <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '18px', gap: '2px' }}>
                {(Object.entries(catT) as [string, number][]).map(([k, v]) => {
                  const p = catSum > 0 ? v / catSum * 100 : 0;
                  return p > 0 ? <div key={k} style={{ width: `${p}%`, background: catCfg[k as keyof typeof catCfg].color, borderRadius: '5px' }} /> : null;
                })}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {(Object.entries(catCfg) as [string, { label: string; color: string }][]).map(([k, cfg]) => {
                  const v = catT[k as keyof typeof catT] || 0;
                  const p = catSum > 0 ? Math.round(v / catSum * 100) : 0;
                  return (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '9px', height: '9px', borderRadius: '3px', background: cfg.color, flexShrink: 0 }} />
                      <span style={{ width: '74px', color: C.text, fontSize: '13px', flexShrink: 0 }}>{cfg.label}</span>
                      <div style={{ flex: 1, height: '5px', background: C.ghost, borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${p}%`, height: '100%', background: cfg.color, borderRadius: '3px' }} />
                      </div>
                      <span style={{ color: C.sub, fontSize: '11px', width: '68px', textAlign: 'right', flexShrink: 0 }}>฿{fmt(v)}</span>
                      <span style={{ color: cfg.color, fontSize: '11px', fontWeight: '700', width: '28px', textAlign: 'right', flexShrink: 0 }}>{p}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ background: C.white, borderRadius: '16px', padding: '22px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: C.sub }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                <div style={{ fontSize: '13px' }}>ยังไม่มีข้อมูลงบประมาณ</div>
              </div>
            </div>
          )}
        </div>

        {/* Recent projects table */}
        <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.line}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,63,160,0.06)' }}>
          <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: C.text }}>โครงการล่าสุด</div>
            <button onClick={() => update({ view: 'projects' })} style={{ background: 'none', border: 'none', color: C.primary, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>ดูทั้งหมด →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '9px 22px', background: C.ghost, borderBottom: `1px solid ${C.line}` }}>
            {['ชื่องาน', 'สถานะ', 'ผู้ควบคุม', 'เบิกจ่าย', 'คงเหลือ', '%'].map((l, i) => (
              <div key={i} style={{ color: C.sub, fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>{l}</div>
            ))}
          </div>
          {pjs.slice(0, 4).map((p, idx) => {
            const sc = statusCfg[p.status];
            const { paid, rem, allocUsable: alloc } = getPjSum(p);
            const pp = alloc > 0 ? Math.round(paid / alloc * 100) : 0;
            return (
              <div key={p.id}
                onClick={() => update({ selectedProjectId: p.id, view: 'project-detail', activeBudgetCat: 'all', activeBudgetStatus: 'all', selectedDivisionId: null })}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', padding: '13px 22px', borderBottom: idx < Math.min(pjs.length, 4) - 1 ? `1px solid ${C.line}` : 'none', cursor: 'pointer', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.background = C.paper)}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: C.text, marginBottom: '2px' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: C.sub }}>{p.approvalNo}</div>
                </div>
                <Badge status={p.status} />
                <div style={{ fontSize: '12px', color: C.text }}>{p.controlPerson}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: C.text }}>฿{fmt(paid)}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: rem >= 0 ? C.green : C.red }}>฿{fmt(rem)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ height: '4px', width: '60px', background: C.ghost, borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(pp, 100)}%`, height: '100%', background: sc.color, borderRadius: '2px' }} />
                  </div>
                  <span style={{ color: sc.color, fontSize: '11px', fontWeight: '700' }}>{pp}%</span>
                </div>
              </div>
            );
          })}
          {pjs.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: C.sub }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>📂</div>
              <div style={{ fontSize: '14px' }}>ยังไม่มีโครงการ</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ bg, label, value, valueColor, sub, icoBg, ico }: {
  bg: string; label: string; value: string; valueColor: string; sub: string; icoBg: string; ico: React.ReactNode;
}) {
  return (
    <div style={{ background: bg, borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(107,63,160,0.07)', border: `1px solid ${C.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ color: C.sub, fontSize: '12px', marginBottom: '8px' }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: '700', lineHeight: '1', color: valueColor }}>{value}</div>
        <div style={{ color: C.sub, fontSize: '11px', marginTop: '4px' }}>{sub}</div>
      </div>
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: icoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {ico}
      </div>
    </div>
  );
}
