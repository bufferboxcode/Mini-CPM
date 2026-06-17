'use client';
import { C, catCfg, statusCfg } from '@/lib/constants';
import { getCatSum, fmt } from '@/lib/utils';
import { TopBar, PrimaryBtn, GhostBtn, Badge, IcoEdit, IcoDel } from '@/components/ui';
import type { SharedProps } from '@/components/PeaApp';
import type { AppState } from '@/lib/types';

const COLS = '6px 2fr 86px 108px 98px 118px 108px 108px 66px 80px';

export default function ProjectDetailView({ S, update, ws, pj, modPj }: SharedProps) {
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar
        title={pj.name}
        sub={`${ws.name} › ${pj.approvalNo}`}
        actions={
          <>
            <GhostBtn label="← กลับ" onClick={() => update({ view: 'projects' })} />
            <PrimaryBtn label="+ เพิ่มประเภทงบ" onClick={() => update({ showModal: 'add-budget-cat', editingCatId: null, form: { ...S.form, bcName: '', bcCat: 'labor', bcAllocTotal: '', bcUsagePct: 100 } })} />
          </>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px' }}>
        {/* Info card */}
        <div style={{ background: C.white, borderRadius: '16px', padding: '22px', marginBottom: '20px', border: `1px solid ${C.line}`, boxShadow: '0 2px 12px rgba(107,63,160,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Badge status={pj.status} />
                <span style={{ color: C.sub, fontSize: '12px' }}>แมก {pj.division}</span>
              </div>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[['เลขที่อนุมัติ', pj.approvalNo], ['ผู้ควบคุมงาน', pj.controlPerson], ['เบอร์โทร', pj.phone], ['วันเริ่มงาน', pj.startDate], ['หมายเลขงาน', pj.budgetRef]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ color: C.sub, fontSize: '11px', marginBottom: '2px' }}>{l}</div>
                    <div style={{ color: C.text, fontSize: '13px', fontWeight: '600' }}>{v || '-'}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '24px' }}>
              <div style={{ color: C.sub, fontSize: '11px', marginBottom: '3px' }}>
                {selDivId ? 'งบแผนก: ' + ((pj.divisions || []).find(d => d.id === selDivId) || { code: '' }).code : 'งบจัดสรรรวมทั้งหมด'}
              </div>
              <div style={{ color: C.primary, fontSize: '26px', fontWeight: '700' }}>฿{fmt(tAllocTotal)}</div>
              <div style={{ color: C.sub, fontSize: '11px' }}>เบิกจ่ายไปแล้ว {pct}%</div>
            </div>
          </div>

          {/* Division selector */}
          <div style={{ marginBottom: '14px', paddingTop: '12px', borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
            <span style={{ color: C.sub, fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>รหัสแผนก</span>
            <button
              onClick={() => update({ selectedDivisionId: null })}
              style={{ padding: '5px 13px', borderRadius: '20px', border: selDivId === null ? `2px solid ${C.primary}` : `1px solid ${C.line}`, background: selDivId === null ? `linear-gradient(135deg,${C.deep},${C.primary})` : 'none', color: selDivId === null ? 'white' : C.sub, fontSize: '12px', fontWeight: selDivId === null ? '700' : '400', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>
              ทั้งหมด
            </button>
            {(pj.divisions || []).map(div => {
              const isAct = selDivId === div.id;
              return (
                <div key={div.id} style={{ display: 'inline-flex', alignItems: 'center', border: isAct ? `2px solid ${C.primary}` : `1px solid ${C.pale}`, borderRadius: '20px', background: isAct ? C.ghost : 'none', overflow: 'hidden' }}>
                  <button
                    onClick={() => update({ selectedDivisionId: isAct ? null : div.id })}
                    style={{ padding: '5px 10px 5px 12px', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: "'SaoChingcha',sans-serif" }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isAct ? C.primary : C.sub, flexShrink: 0 }} />
                    <span style={{ color: isAct ? C.primary : C.text, fontSize: '12px', fontWeight: isAct ? '700' : '500' }}>{div.code}</span>
                    <span style={{ color: C.sub, fontSize: '10px' }}>{div.networkCode ? '· ' + div.networkCode : ''}</span>
                  </button>
                  <button
                    onClick={() => update({ showModal: 'view-division', viewingDivId: div.id })}
                    title="ดูรายละเอียด"
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
              style={{ background: 'none', border: `1.5px dashed ${C.pale}`, borderRadius: '20px', padding: '5px 11px', cursor: 'pointer', color: C.sub, fontSize: '11px', fontFamily: "'SaoChingcha',sans-serif", display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={C.sub} strokeWidth="2.5" strokeLinecap="round" /></svg>
              + เพิ่มแผนก
            </button>
          </div>

          {/* Budget summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            {[['งบจัดสรรรวม', fmt(tAllocTotal), C.text], ['งบที่ใช้ได้จริง', fmt(tAlloc), C.primary], ['รวมเบิกจ่าย', fmt(tPaid), C.text], ['คงเหลือ', fmt(tRem), tRem >= 0 ? C.green : C.red]].map(([l, v, col]) => (
              <div key={l} style={{ background: C.paper, borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ color: C.sub, fontSize: '11px', marginBottom: '3px' }}>{l}</div>
                <div style={{ color: col, fontSize: '16px', fontWeight: '700' }}>฿{v}</div>
              </div>
            ))}
          </div>
          <div style={{ height: '6px', background: C.ghost, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: `linear-gradient(90deg,${C.primary},${C.mid})`, borderRadius: '3px' }} />
          </div>
        </div>

        {/* Budget register table */}
        <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.line}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,63,160,0.06)' }}>
          <div style={{ padding: '14px 22px', borderBottom: `1px solid ${C.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: C.text }}>ทะเบียนลงคุมงบค่าใช้จ่าย</div>
              <div style={{ fontSize: '11px', color: C.sub, marginTop: '2px' }}>จัดสรรงบตามประเภท → บันทึกรายการเบิกจ่าย</div>
            </div>
            <div style={{ color: C.sub, fontSize: '12px' }}>{shownCats.length} / {(pj.budgetCats || []).length} ประเภทงบ</div>
          </div>

          {/* Filters */}
          <div style={{ padding: '10px 22px', borderBottom: `1px solid ${C.line}`, display: 'flex', gap: '16px', alignItems: 'center', background: C.paper, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ color: C.sub, fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>ประเภท</span>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {(['all', 'labor', 'supervision', 'transport', 'misc'] as const).map(cat => {
                  const labels = { all: 'ทั้งหมด', labor: 'ค่าแรง', supervision: 'ค่าควบคุมงาน', transport: 'ค่าขนส่ง', misc: 'ค่าเบ็ดเตล็ด' };
                  const isA = wCf === cat;
                  const cfg = catCfg[cat as keyof typeof catCfg];
                  return (
                    <button key={cat} onClick={() => update({ activeBudgetCat: cat })}
                      style={{ padding: '4px 12px', borderRadius: '20px', border: isA ? 'none' : `1px solid ${C.line}`, background: isA ? (cfg ? cfg.bg : C.ghost) : 'none', color: isA ? (cfg ? cfg.color : C.primary) : C.sub, fontSize: '11px', fontWeight: isA ? '700' : '400', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif", whiteSpace: 'nowrap' }}>
                      {labels[cat]}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ width: '1px', height: '18px', background: C.line, flexShrink: 0 }} />
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ color: C.sub, fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>สถานะงบ</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                {(['all', 'unused', 'inbudget', 'over'] as const).map(st => {
                  const sCfg = { all: { label: 'ทั้งหมด', color: C.primary, bg: C.ghost }, unused: { label: 'ยังไม่เบิก', color: C.sub, bg: '#F0EDF8' }, inbudget: { label: 'ในงบ ✓', color: C.green, bg: C.greenBg }, over: { label: 'เกินงบ ⚠', color: C.red, bg: C.redBg } };
                  const isA = wCs === st;
                  const cfg2 = sCfg[st];
                  return (
                    <button key={st} onClick={() => update({ activeBudgetStatus: st })}
                      style={{ padding: '4px 12px', borderRadius: '20px', border: isA ? 'none' : `1px solid ${C.line}`, background: isA ? cfg2.bg : 'none', color: isA ? cfg2.color : C.sub, fontSize: '11px', fontWeight: isA ? '700' : '400', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif", whiteSpace: 'nowrap' }}>
                      {cfg2.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: COLS, padding: '9px 22px', background: C.ghost, borderBottom: `1px solid ${C.line}`, alignItems: 'center' }}>
            {['', 'ประเภทงบ / รายการเบิกจ่าย', 'ประเภท', 'งบจัดสรรรวม', 'ใช้งบ', 'งบที่ใช้ได้จริง', 'รวมเบิกจ่าย', 'คงเหลือ', '%', 'จัดการ'].map((l, i) => (
              <div key={i} style={{ color: C.sub, fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>{l}</div>
            ))}
          </div>

          {/* Body */}
          {shownCats.length === 0 ? (
            <div style={{ padding: '50px', textAlign: 'center', color: C.sub }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                {(pj.budgetCats || []).length === 0 ? 'ยังไม่มีประเภทงบ' : 'ไม่พบตามตัวกรอง'}
              </div>
              <div style={{ fontSize: '12px' }}>
                {(pj.budgetCats || []).length === 0 ? 'กด "+ เพิ่มประเภทงบ" เพื่อเริ่มต้น' : 'ลองเปลี่ยนตัวกรองด้านบน'}
              </div>
            </div>
          ) : (
            <>
              {shownCats.map((cat, catIdx) => {
                const cfg = catCfg[cat.cat] || { label: cat.cat, color: C.primary, bg: C.ghost };
                const { allocUsable, paid, rem } = getCatSum(cat);
                const sp = allocUsable > 0 ? Math.round(paid / allocUsable * 100) : 0;
                const isLast = catIdx === shownCats.length - 1;
                const isCollapsed = !!S.collapsedCats[cat.id];
                const toggleCollapse = (e?: React.MouseEvent) => {
                  e?.stopPropagation();
                  update({ collapsedCats: { ...S.collapsedCats, [cat.id]: !S.collapsedCats[cat.id] } });
                };

                return (
                  <div key={cat.id}>
                    {/* Category header row */}
                    <div onClick={toggleCollapse}
                      style={{ display: 'grid', gridTemplateColumns: COLS, padding: '11px 22px', background: cfg.bg, borderBottom: `1px solid ${C.line}`, alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
                      <div style={{ width: '4px', height: '34px', background: cfg.color, borderRadius: '2px' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.18s ease' }}>
                          <path d="M6 9l6 6 6-6" stroke={cfg.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: C.text, marginBottom: '3px' }}>{cat.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '10px', color: cfg.color }}>{(cat.transactions || []).length} รายการเบิกจ่าย</span>
                            {cat.divisionId && (() => {
                              const dv = (pj.divisions || []).find(d => d.id === cat.divisionId);
                              return dv ? (
                                <button onClick={e => { e.stopPropagation(); update({ showModal: 'view-division', viewingDivId: dv.id }); }}
                                  style={{ background: C.white, border: `1px solid ${C.pale}`, borderRadius: '20px', padding: '1px 8px', cursor: 'pointer', color: C.primary, fontSize: '9px', fontWeight: '700', fontFamily: "'SaoChingcha',sans-serif", display: 'inline-flex', alignItems: 'center', gap: '3px', lineHeight: '1.7' }}>
                                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.primary }} />
                                  {dv.code}
                                </button>
                              ) : null;
                            })()}
                          </div>
                        </div>
                      </div>
                      <span style={{ background: 'white', color: cfg.color, fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', border: `1px solid ${cfg.color}30`, display: 'inline-block' }}>{cfg.label}</span>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: C.text }}>฿{fmt(cat.allocTotal)}</div>
                      {/* 80/100 toggle */}
                      <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.07)', borderRadius: '8px', padding: '2px', gap: '1px', maxWidth: '100%', flexShrink: 0 }}>
                        {[80, 100].map(pv => {
                          const isAct = cat.usagePct === pv;
                          return (
                            <button key={pv}
                              onClick={e => {
                                e.stopPropagation();
                                modPj(p => ({ ...p, budgetCats: p.budgetCats.map(c => c.id === cat.id ? { ...c, usagePct: pv } : c) }));
                              }}
                              style={{ padding: '3px 8px', borderRadius: '6px', border: 'none', background: isAct ? cfg.color : 'transparent', color: isAct ? 'white' : C.sub, fontSize: '11px', fontWeight: '700', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif", whiteSpace: 'nowrap', lineHeight: '1.2' }}>
                              {pv}%
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: cfg.color }}>฿{fmt(allocUsable)}</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: C.text }}>฿{fmt(paid)}</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: rem >= 0 ? C.green : C.red }}>฿{fmt(rem)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ height: '5px', flex: 1, background: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(sp, 100)}%`, height: '100%', background: cfg.color, borderRadius: '3px' }} />
                        </div>
                        <span style={{ color: cfg.color, fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{sp}%</span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={e => { e.stopPropagation(); update({ showModal: 'add-budget-cat', editingCatId: cat.id, form: { ...S.form, bcName: cat.name, bcCat: cat.cat, bcAllocTotal: String(cat.allocTotal), bcUsagePct: cat.usagePct } }); }}
                          style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IcoEdit />
                        </button>
                        <button onClick={e => { e.stopPropagation(); modPj(p => ({ ...p, budgetCats: p.budgetCats.filter(c => c.id !== cat.id) })); }}
                          style={{ width: '28px', height: '28px', borderRadius: '7px', background: C.redBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IcoDel />
                        </button>
                      </div>
                    </div>

                    {/* Transaction rows */}
                    {!isCollapsed && (cat.transactions || []).map(tx => (
                      <div key={tx.id}
                        style={{ display: 'grid', gridTemplateColumns: COLS, padding: '9px 22px', borderBottom: `1px solid ${C.line}`, alignItems: 'center', background: C.white }}
                        onMouseEnter={e => (e.currentTarget.style.background = C.paper)}
                        onMouseLeave={e => (e.currentTarget.style.background = C.white)}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '2px', height: '28px', background: cfg.color + '40', borderRadius: '1px' }} />
                        </div>
                        <div style={{ paddingLeft: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                            <div style={{ fontSize: '13px', color: C.text }}>{tx.desc}</div>
                          </div>
                          <div style={{ fontSize: '10px', color: C.sub, paddingLeft: '11px', marginTop: '2px' }}>{tx.date || ''}</div>
                        </div>
                        <div /><div /><div /><div />
                        <div style={{ fontSize: '13px', fontWeight: '700', color: C.text }}>฿{fmt(tx.amount)}</div>
                        <div /><div />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => update({ showModal: 'add-transaction', editingTxId: tx.id, targetCatId: cat.id, form: { ...S.form, txDesc: tx.desc, txAmount: String(tx.amount), txDate: tx.date || '' } })}
                            style={{ width: '28px', height: '28px', borderRadius: '7px', background: C.ghost, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IcoEdit />
                          </button>
                          <button onClick={() => modPj(p => ({ ...p, budgetCats: p.budgetCats.map(c => c.id === cat.id ? { ...c, transactions: c.transactions.filter(t => t.id !== tx.id) } : c) }))}
                            style={{ width: '28px', height: '28px', borderRadius: '7px', background: C.redBg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IcoDel />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add transaction button */}
                    {!isCollapsed && (
                      <div style={{ padding: '8px 22px 8px 50px', borderBottom: isLast ? 'none' : `2px solid ${C.ghost}`, background: C.white }}>
                        <button onClick={() => update({ showModal: 'add-transaction', editingTxId: null, targetCatId: cat.id, form: { ...S.form, txDesc: '', txAmount: '', txDate: '' } })}
                          style={{ background: 'none', border: `1.5px dashed ${cfg.color}70`, borderRadius: '8px', padding: '5px 14px', cursor: 'pointer', color: cfg.color, fontSize: '12px', fontWeight: '600', fontFamily: "'SaoChingcha',sans-serif", display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round" /></svg>
                          + เพิ่มรายการเบิกจ่าย ({cfg.label})
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Totals row */}
              <div style={{ display: 'grid', gridTemplateColumns: COLS, padding: '12px 22px', background: C.ghost, borderTop: `2px solid ${C.pale}`, alignItems: 'center' }}>
                <div /><div style={{ fontSize: '13px', fontWeight: '700', color: C.text }}>รวมทั้งหมด</div><div />
                <div style={{ fontSize: '13px', fontWeight: '700', color: C.primary }}>฿{fmt(tAllocTotal)}</div><div />
                <div style={{ fontSize: '13px', fontWeight: '700', color: C.primary }}>฿{fmt(tAlloc)}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: C.text }}>฿{fmt(tPaid)}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: tRem >= 0 ? C.green : C.red }}>฿{fmt(tRem)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ height: '5px', flex: 1, background: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: `linear-gradient(90deg,${C.primary},${C.mid})`, borderRadius: '3px' }} />
                  </div>
                  <span style={{ color: C.primary, fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{pct}%</span>
                </div>
                <div />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
