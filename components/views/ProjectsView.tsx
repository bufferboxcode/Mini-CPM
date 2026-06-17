'use client';
import { C, statusCfg } from '@/lib/constants';
import { getPjSum, fmt } from '@/lib/utils';
import { TopBar, PrimaryBtn, Badge } from '@/components/ui';
import type { SharedProps } from '@/components/PeaApp';

export default function ProjectsView({ S, update, ws }: SharedProps) {
  if (!ws) return null;
  const ft = S.filterStatus || 'all';
  const q = (S.searchQuery || '').toLowerCase();
  const filtered = ws.projects
    .filter(p => ft === 'all' || p.status === ft)
    .filter(p => !q || p.name.toLowerCase().includes(q) || p.controlPerson.toLowerCase().includes(q) || p.approvalNo.toLowerCase().includes(q));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar
        title="โครงการทั้งหมด"
        sub={`${ws.name} • ${ws.projects.length} แฟ้มงาน`}
        actions={
          <PrimaryBtn label="+ สร้างแฟ้มงาน" onClick={() => update({ showModal: 'add-project', form: { ...S.form, pjName: '', pjApproval: '', pjControl: '', pjPhone: '', pjStart: '', pjRef: '', pjDiv: '', pjBudget: '' } })} noIcon />
        }
      />

      {/* Filter bar */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.line}`, padding: '10px 28px', display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ position: 'relative', flex: '0 0 300px' }}>
          <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke={C.sub} strokeWidth="1.8" />
            <path d="M16.5 16.5L21 21" stroke={C.sub} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text" value={S.searchQuery || ''} onChange={e => update({ searchQuery: e.target.value })}
            placeholder="ค้นหาชื่องาน, เลขอนุมัติ..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '10px', border: `1.5px solid ${C.line}`, fontSize: '13px', fontFamily: "'SaoChingcha',sans-serif", color: C.text, background: C.paper, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'active', 'pending', 'completed', 'cancelled'] as const).map(t => {
            const labels = { all: 'ทั้งหมด', active: 'กำลังดำเนิน', pending: 'รอดำเนิน', completed: 'เสร็จแล้ว', cancelled: 'ยกเลิก' };
            const isA = ft === t;
            const sc = statusCfg[t as keyof typeof statusCfg];
            return (
              <button key={t} onClick={() => update({ filterStatus: t })}
                style={{ padding: '6px 14px', borderRadius: '20px', border: isA ? 'none' : `1px solid ${C.line}`, background: isA ? (sc ? sc.bg : C.ghost) : 'none', color: isA ? (sc ? sc.color : C.primary) : C.sub, fontSize: '12px', fontWeight: isA ? '700' : '400', cursor: 'pointer', fontFamily: "'SaoChingcha',sans-serif" }}>
                {labels[t]}
              </button>
            );
          })}
        </div>
        <div style={{ marginLeft: 'auto', color: C.sub, fontSize: '12px' }}>{filtered.length} รายการ</div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
        <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.line}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,63,160,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 0.9fr 1fr 1fr 1fr', padding: '10px 22px', background: C.ghost, borderBottom: `1px solid ${C.line}` }}>
            {['ชื่องาน / เลขอนุมัติ', 'สถานะ', 'ผู้ควบคุมงาน', 'วันเริ่มงาน', 'เบิกจ่าย', 'คงเหลือ', 'ความคืบหน้า'].map((l, i) => (
              <div key={i} style={{ color: C.sub, fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>{l}</div>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: C.sub }}>
              <div style={{ fontSize: '44px', marginBottom: '10px' }}>📂</div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>ไม่พบโครงการ</div>
              <div style={{ fontSize: '12px' }}>ลองเปลี่ยนคีย์เวิร์ดหรือตัวกรอง</div>
            </div>
          ) : filtered.map((p, idx) => {
            const sc = statusCfg[p.status];
            const { paid, rem, allocUsable: alloc } = getPjSum(p);
            const pp = alloc > 0 ? Math.round(paid / alloc * 100) : 0;
            return (
              <div key={p.id}
                onClick={() => update({ selectedProjectId: p.id, view: 'project-detail', activeBudgetCat: 'all', activeBudgetStatus: 'all', selectedDivisionId: null })}
                style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 0.9fr 1fr 1fr 1fr', padding: '14px 22px', borderBottom: idx < filtered.length - 1 ? `1px solid ${C.line}` : 'none', cursor: 'pointer', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.background = C.paper)}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: C.text, lineHeight: '1.35', marginBottom: '3px' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: C.sub }}>{p.approvalNo} • แมก {p.division}</div>
                </div>
                <Badge status={p.status} />
                <div style={{ fontSize: '12px', color: C.text }}>{p.controlPerson}</div>
                <div style={{ fontSize: '12px', color: C.sub }}>{p.startDate}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: C.text }}>฿{fmt(paid)}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: rem >= 0 ? C.green : C.red }}>฿{fmt(rem)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ height: '5px', flex: 1, maxWidth: '80px', background: C.ghost, borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(pp, 100)}%`, height: '100%', background: sc.color, borderRadius: '3px' }} />
                  </div>
                  <span style={{ color: sc.color, fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{pp}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
