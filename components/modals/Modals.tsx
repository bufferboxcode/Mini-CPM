'use client';
import { C, catCfg } from '@/lib/constants';
import { getCatSum, fmt } from '@/lib/utils';
import { Backdrop, ModalBox, MI, MRow, MSave } from '@/components/ui/Modal';
import type { SharedProps } from '@/components/PeaApp';

export default function Modals(props: SharedProps) {
  const { S } = props;
  if (!S.showModal) return null;
  return (
    <>
      {S.showModal === 'add-workspace' && <AddWsModal {...props} />}
      {S.showModal === 'add-project' && <AddPjModal {...props} />}
      {S.showModal === 'add-budget-cat' && <AddBudgetCatModal {...props} />}
      {S.showModal === 'add-transaction' && <AddTransactionModal {...props} />}
      {S.showModal === 'add-division' && <AddDivisionModal {...props} />}
      {S.showModal === 'view-division' && <ViewDivisionModal {...props} />}
    </>
  );
}

function AddWsModal({ S, update, closeModal }: SharedProps) {
  const f = S.form;
  return (
    <Backdrop onClose={closeModal}>
      <ModalBox title="สร้าง Workspace ใหม่" width="440px" onClose={closeModal}>
        <MI label="ชื่อ Workspace" value={f.wsName} onChange={e => update({ form: { ...f, wsName: e.target.value } })} placeholder="เช่น งบประมาณ 2569" />
        <MRow>
          <MI label="ปีงบประมาณ (พ.ศ.)" type="number" value={f.wsYear} onChange={e => update({ form: { ...f, wsYear: e.target.value } })} placeholder="2569" />
          <MI label="งบประมาณรวม (บาท)" type="number" value={f.wsBudget} onChange={e => update({ form: { ...f, wsBudget: e.target.value } })} placeholder="0" />
        </MRow>
        <MI label="หน่วยงาน" value={f.wsDept} onChange={e => update({ form: { ...f, wsDept: e.target.value } })} placeholder="กฟภ. สาขาย่อย เขต 1" />
        <MSave label="สร้าง Workspace" onClick={() => {
          if (!f.wsName) return;
          const nw = { id: Date.now(), name: f.wsName, year: parseInt(f.wsYear) || 2568, dept: f.wsDept || 'กฟภ.', totalBudget: parseFloat(f.wsBudget) || 0, projects: [] };
          update({ workspaces: [...S.workspaces, nw], showModal: null, selectedWorkspaceId: nw.id, view: 'dashboard' });
        }} />
      </ModalBox>
    </Backdrop>
  );
}

function AddPjModal({ S, update, closeModal }: SharedProps) {
  const f = S.form;
  return (
    <Backdrop onClose={closeModal}>
      <ModalBox title="สร้างแฟ้มงานใหม่" width="540px" onClose={closeModal}>
        <MI label="ชื่องาน" value={f.pjName} onChange={e => update({ form: { ...f, pjName: e.target.value } })} placeholder="เช่น งาน กฟร.99 สาย 6 หาง ศรีวิไล" />
        <MRow>
          <MI label="เลขที่อนุมัติ" value={f.pjApproval} onChange={e => update({ form: { ...f, pjApproval: e.target.value } })} placeholder="เช่น ศก(333) 66/69" />
          <MI label="วันที่เริ่มงาน" value={f.pjStart} onChange={e => update({ form: { ...f, pjStart: e.target.value } })} placeholder="เช่น 01 มิ.ย. 69" />
        </MRow>
        <MRow>
          <MI label="ผู้ควบคุมงาน (พง.)" value={f.pjControl} onChange={e => update({ form: { ...f, pjControl: e.target.value } })} placeholder="ชื่อ-นามสกุล" />
          <MI label="เบอร์โทรติดต่อ" type="tel" value={f.pjPhone} onChange={e => update({ form: { ...f, pjPhone: e.target.value } })} placeholder="08X-XXX-XXXX" />
        </MRow>
        <MI label="หมายเลขงาน / หนังสืออ้างอิง" value={f.pjRef} onChange={e => update({ form: { ...f, pjRef: e.target.value } })} placeholder="เช่น C-69-B-TAK-CS-7009.01.9" />
        <MRow>
          <MI label="แผนก / แมก" value={f.pjDiv} onChange={e => update({ form: { ...f, pjDiv: e.target.value } })} placeholder="เช่น 103ช่" />
          <MI label="งบประมาณรวม (บาท)" type="number" value={f.pjBudget} onChange={e => update({ form: { ...f, pjBudget: e.target.value } })} placeholder="0" />
        </MRow>
        <MSave label="สร้างแฟ้มงาน" onClick={() => {
          if (!f.pjName) return;
          const np = { id: Date.now(), name: f.pjName, approvalNo: f.pjApproval || '', controlPerson: f.pjControl || '', phone: f.pjPhone || '', startDate: f.pjStart || '', budgetRef: f.pjRef || '', division: f.pjDiv || '', status: 'pending' as const, totalBudget: parseFloat(f.pjBudget) || 0, budgetCats: [] };
          update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: [...w.projects, np] } : w), showModal: null });
        }} />
      </ModalBox>
    </Backdrop>
  );
}

function AddBudgetCatModal({ S, update, closeModal, pj }: SharedProps) {
  const f = S.form;
  const isEdit = S.editingCatId !== null;
  const alloc = parseFloat(f.bcAllocTotal) || 0;
  const divs = pj?.divisions || [];
  return (
    <Backdrop onClose={closeModal}>
      <ModalBox title={isEdit ? 'แก้ไขประเภทงบ' : 'เพิ่มประเภทงบใหม่'} width="480px" onClose={closeModal}>
        {/* Cat type selector */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ color: C.sub, fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>ประเภท</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {(Object.entries(catCfg) as [string, { label: string; color: string; bg: string }][]).map(([k, cfg]) => {
              const sel = (f.bcCat || 'labor') === k;
              return (
                <button key={k} onClick={() => update({ form: { ...f, bcCat: k as typeof f.bcCat } })}
                  style={{ padding: '10px 8px', borderRadius: '10px', cursor: 'pointer', border: sel ? `2px solid ${cfg.color}` : `1.5px solid ${C.line}`, background: sel ? cfg.bg : C.white, color: sel ? cfg.color : C.sub, fontSize: '13px', fontWeight: '600', fontFamily: "'SaoChingcha',sans-serif" }}>
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
        <MI label="งบจัดสรรรวม (บาท)" type="number" value={f.bcAllocTotal} onChange={e => update({ form: { ...f, bcAllocTotal: e.target.value } })} placeholder="0" />
        {/* Usage pct */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ color: C.sub, fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>เลือกสัดส่วนการใช้งบ</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[80, 100].map(pv => {
              const isSel = (f.bcUsagePct || 100) === pv;
              const effAmt = Math.round(alloc * pv / 100);
              return (
                <button key={pv} onClick={() => update({ form: { ...f, bcUsagePct: pv } })}
                  style={{ padding: '14px 10px', borderRadius: '12px', cursor: 'pointer', border: isSel ? `2px solid ${C.primary}` : `1.5px solid ${C.line}`, background: isSel ? C.ghost : C.white, fontFamily: "'SaoChingcha',sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ color: isSel ? C.primary : C.sub, fontSize: '22px', fontWeight: '700' }}>{pv}%</div>
                  <div style={{ color: C.sub, fontSize: '11px' }}>ใช้ได้ ฿{fmt(effAmt)}</div>
                  {isSel && <div style={{ marginTop: '2px', fontSize: '10px', color: C.primary, fontWeight: '600' }}>{pv === 80 ? '🛡️ สำรองงบ 20%' : '✅ ใช้งบเต็มจำนวน'}</div>}
                </button>
              );
            })}
          </div>
        </div>
        {alloc > 0 && (
          <div style={{ background: C.ghost, borderRadius: '12px', padding: '12px 16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: C.sub, fontSize: '11px', marginBottom: '3px' }}>งบที่ใช้ได้จริง</div>
              <div style={{ color: C.primary, fontSize: '22px', fontWeight: '700' }}>฿{fmt(Math.round(alloc * (f.bcUsagePct || 100) / 100))}</div>
            </div>
            <div style={{ color: C.sub, fontSize: '11px', textAlign: 'right', whiteSpace: 'pre-line' }}>{`${100 - (f.bcUsagePct || 100)}% สำรองไว้\n฿${fmt(alloc - Math.round(alloc * (f.bcUsagePct || 100) / 100))}`}</div>
          </div>
        )}
        {/* Division link */}
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
                  {div.code} · {div.networkCode}
                </button>
              ))}
            </div>
          </div>
        )}
        <MSave label={isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มประเภทงบ'} onClick={() => {
          const autoName = (catCfg[f.bcCat] || { label: f.bcCat }).label;
          const saveName = f.bcName || autoName;
          if (isEdit) {
            update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? { ...p, budgetCats: p.budgetCats.map(c => c.id === S.editingCatId ? { ...c, name: saveName, cat: f.bcCat, allocTotal: parseFloat(f.bcAllocTotal) || 0, usagePct: f.bcUsagePct || 100, divisionId: f.bcDivisionId || null } : c) } : p) } : w), showModal: null, editingCatId: null });
          } else {
            const nc = { id: Date.now(), cat: f.bcCat, name: saveName, allocTotal: parseFloat(f.bcAllocTotal) || 0, usagePct: f.bcUsagePct || 100, divisionId: f.bcDivisionId || null, transactions: [] };
            update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? { ...p, budgetCats: [...(p.budgetCats || []), nc] } : p) } : w), showModal: null });
          }
        }} />
      </ModalBox>
    </Backdrop>
  );
}

function AddTransactionModal({ S, update, closeModal, pj }: SharedProps) {
  const f = S.form;
  const isEdit = S.editingTxId !== null;
  const cat = pj ? (pj.budgetCats || []).find(c => c.id === S.targetCatId) : null;
  const cfg = cat ? catCfg[cat.cat] : null;
  const catS = cat ? getCatSum(cat) : null;
  const amt = parseFloat(f.txAmount) || 0;
  const prevAmt = isEdit && cat ? ((cat.transactions || []).find(t => t.id === S.editingTxId) || { amount: 0 }).amount : 0;
  const newRem = catS ? catS.allocUsable - (catS.paid - prevAmt + amt) : 0;
  return (
    <Backdrop onClose={closeModal}>
      <ModalBox title={isEdit ? 'แก้ไขรายการเบิกจ่าย' : 'เพิ่มรายการเบิกจ่าย'} width="460px" onClose={closeModal}>
        {cat && cfg && (
          <div style={{ background: cfg.bg, borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color }} />
              <span style={{ color: cfg.color, fontSize: '12px', fontWeight: '700' }}>เบิกจ่ายจาก: {cat.name}</span>
            </div>
            <span style={{ color: C.sub, fontSize: '11px' }}>งบคงเหลือ: ฿{fmt(catS!.rem)}</span>
          </div>
        )}
        <MI label="ชื่อรายการ / หมายเหตุ" value={f.txDesc} onChange={e => update({ form: { ...f, txDesc: e.target.value } })} placeholder="เช่น เบิกค่าแรง งวด 1" />
        <MRow>
          <MI label="จำนวนเงิน (บาท)" type="number" value={f.txAmount} onChange={e => update({ form: { ...f, txAmount: e.target.value } })} placeholder="0" />
          <MI label="วันที่เบิกจ่าย" value={f.txDate} onChange={e => update({ form: { ...f, txDate: e.target.value } })} placeholder="เช่น 25 มิ.ย. 69" />
        </MRow>
        {amt > 0 && (
          <div style={{ background: newRem >= 0 ? C.greenBg : C.redBg, borderRadius: '12px', padding: '12px 16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: C.sub, fontSize: '11px', marginBottom: '3px' }}>คงเหลือหลังเบิก</div>
              <div style={{ color: newRem >= 0 ? C.green : C.red, fontSize: '22px', fontWeight: '700' }}>฿{fmt(newRem)}</div>
            </div>
            <div style={{ fontSize: '26px' }}>{newRem >= 0 ? '✅' : '⚠️'}</div>
          </div>
        )}
        <MSave label={isEdit ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'} onClick={() => {
          if (!f.txDesc || !f.txAmount) return;
          const nt = { id: isEdit ? S.editingTxId! : Date.now(), desc: f.txDesc, amount: parseFloat(f.txAmount) || 0, date: f.txDate || '' };
          update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? { ...p, budgetCats: p.budgetCats.map(c => c.id === S.targetCatId ? { ...c, transactions: isEdit ? c.transactions.map(t => t.id === S.editingTxId ? nt : t) : [...(c.transactions || []), nt] } : c) } : p) } : w), showModal: null, editingTxId: null, targetCatId: null });
        }} />
      </ModalBox>
    </Backdrop>
  );
}

function AddDivisionModal({ S, update, closeModal }: SharedProps) {
  const f = S.form;
  const isEdit = S.editingDivId !== null;
  return (
    <Backdrop onClose={closeModal}>
      <ModalBox title={isEdit ? 'แก้ไขรหัสแผนก' : 'เพิ่มรหัสแผนก'} width="440px" onClose={closeModal}>
        <MI label="รหัสแผนก" value={f.divCode} onChange={e => update({ form: { ...f, divCode: e.target.value } })} placeholder="เช่น HT-C-E, LT-C-E, TR-C-E" />
        <MI label="รหัสเครือข่าย" value={f.divNetworkCode} onChange={e => update({ form: { ...f, divNetworkCode: e.target.value } })} placeholder="เช่น 8005204585" />
        <MI label="คำอธิบาย (ไม่บังคับ)" value={f.divDesc} onChange={e => update({ form: { ...f, divDesc: e.target.value } })} placeholder="เช่น แรงสูง-โยธา-ไฟฟ้า" />
        <MSave label={isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มรหัสแผนก'} onClick={() => {
          if (!f.divCode) return;
          const nd = { id: isEdit ? S.editingDivId! : Date.now(), code: f.divCode, networkCode: f.divNetworkCode || '', desc: f.divDesc || '' };
          update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? { ...p, divisions: isEdit ? (p.divisions || []).map(d => d.id === S.editingDivId ? nd : d) : [...(p.divisions || []), nd] } : p) } : w), showModal: null, editingDivId: null });
        }} />
      </ModalBox>
    </Backdrop>
  );
}

function ViewDivisionModal({ S, update, closeModal, pj }: SharedProps) {
  if (!pj) return null;
  const div = (pj.divisions || []).find(d => d.id === S.viewingDivId);
  if (!div) return null;
  const linkedCats = (pj.budgetCats || []).filter(c => c.divisionId === div.id);
  const sums = linkedCats.map(c => getCatSum(c));
  const tA = sums.reduce((s, x) => s + x.allocUsable, 0);
  const tP = sums.reduce((s, x) => s + x.paid, 0);
  const tR = sums.reduce((s, x) => s + x.rem, 0);
  return (
    <Backdrop onClose={closeModal}>
      <ModalBox title="รายละเอียดแผนก" width="520px" onClose={closeModal}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: C.ghost, borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ color: C.sub, fontSize: '11px', marginBottom: '4px' }}>รหัสแผนก</div>
            <div style={{ color: C.primary, fontSize: '22px', fontWeight: '700', letterSpacing: '0.5px' }}>{div.code}</div>
          </div>
          <div style={{ background: C.ghost, borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ color: C.sub, fontSize: '11px', marginBottom: '4px' }}>รหัสเครือข่าย</div>
            <div style={{ color: C.text, fontSize: '22px', fontWeight: '700' }}>{div.networkCode || '-'}</div>
          </div>
        </div>
        {div.desc && <div style={{ color: C.sub, fontSize: '12px', marginBottom: '16px', background: C.paper, borderRadius: '10px', padding: '10px 14px' }}>{div.desc}</div>}
        <div style={{ fontSize: '13px', fontWeight: '700', color: C.text, marginBottom: '10px' }}>ประเภทงบที่เชื่อมโยง ({linkedCats.length} รายการ)</div>
        {linkedCats.length === 0 ? (
          <div style={{ color: C.sub, fontSize: '12px', padding: '16px', textAlign: 'center', background: C.paper, borderRadius: '10px', marginBottom: '14px' }}>
            ยังไม่มีประเภทงบที่เชื่อมโยง — เพิ่มประเภทงบแล้วเลือกแผนกนี้
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            {linkedCats.map(c => {
              const cfg = catCfg[c.cat];
              const s = getCatSum(c);
              const sp = s.allocUsable > 0 ? Math.round(s.paid / s.allocUsable * 100) : 0;
              return (
                <div key={c.id} style={{ background: cfg.bg, borderRadius: '12px', padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: C.text, marginBottom: '3px' }}>{c.name}</div>
                    <span style={{ background: 'white', color: cfg.color, fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>{cfg.label}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: C.text, fontSize: '13px', fontWeight: '700' }}>฿{fmt(s.allocUsable)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px', justifyContent: 'flex-end' }}>
                      <div style={{ height: '4px', width: '56px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(sp, 100)}%`, height: '100%', background: cfg.color, borderRadius: '2px' }} />
                      </div>
                      <span style={{ color: cfg.color, fontSize: '10px', fontWeight: '700' }}>{sp}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {linkedCats.length > 0 && (
          <div style={{ background: C.ghost, borderRadius: '12px', padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div><div style={{ color: C.sub, fontSize: '10px', marginBottom: '3px' }}>งบที่ใช้ได้จริง</div><div style={{ color: C.primary, fontSize: '14px', fontWeight: '700' }}>฿{fmt(tA)}</div></div>
            <div><div style={{ color: C.sub, fontSize: '10px', marginBottom: '3px' }}>รวมเบิกจ่าย</div><div style={{ color: C.text, fontSize: '14px', fontWeight: '700' }}>฿{fmt(tP)}</div></div>
            <div><div style={{ color: C.sub, fontSize: '10px', marginBottom: '3px' }}>คงเหลือ</div><div style={{ color: tR >= 0 ? C.green : C.red, fontSize: '14px', fontWeight: '700' }}>฿{fmt(tR)}</div></div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => update({ showModal: 'add-division', editingDivId: div.id, viewingDivId: null, form: { ...S.form, divCode: div.code, divNetworkCode: div.networkCode || '', divDesc: div.desc || '' } })}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', background: C.ghost, border: 'none', color: C.primary, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>
            ✏️ แก้ไข
          </button>
          <button onClick={() => {
            update({ workspaces: S.workspaces.map(w => w.id === S.selectedWorkspaceId ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? { ...p, divisions: (p.divisions || []).filter(d => d.id !== div.id) } : p) } : w), showModal: null, viewingDivId: null });
          }} style={{ padding: '10px 16px', borderRadius: '10px', background: C.redBg, border: 'none', color: C.red, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>
            🗑️ ลบ
          </button>
        </div>
      </ModalBox>
    </Backdrop>
  );
}
