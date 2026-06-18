'use client';
import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { C, catCfg, statusCfg } from '@/lib/constants';
import { getCatSum, getPjSum, fmt } from '@/lib/utils';
import { INITIAL_WORKSPACES, INITIAL_FORM } from '@/lib/data';
import type { AppState, Workspace, Project } from '@/lib/types';
import Sidebar from './Sidebar';
import DashboardView from './views/DashboardView';
import ProjectsView from './views/ProjectsView';
import ProjectDetailView from './views/ProjectDetailView';
import Modals from './modals/Modals';
import MobileApp from './mobile/MobileApp';

export type { C };
export { getCatSum, getPjSum, fmt, catCfg, statusCfg };

const INITIAL_STATE: AppState = {
  view: 'dashboard',
  mobileScreen: 'workspace-list',
  selectedWorkspaceId: null,
  selectedProjectId: null,
  showModal: null,
  editingCatId: null,
  editingProjectId: null,
  editingTxId: null,
  targetCatId: null,
  editingDivId: null,
  viewingDivId: null,
  selectedDivisionId: null,
  filterStatus: 'all',
  activeBudgetCat: 'all',
  activeBudgetStatus: 'all',
  collapsedCats: {},
  searchQuery: '',
  showWsDropdown: false,
  form: INITIAL_FORM,
  workspaces: INITIAL_WORKSPACES,
};

export interface SharedProps {
  S: AppState;
  update: (patch: Partial<AppState>) => void;
  ws: Workspace | undefined;
  pj: Project | undefined;
  closeModal: () => void;
  modPj: (fn: (p: Project) => Project) => void;
}

export default function PeaApp() {
  const [S, setS] = useState<AppState>(INITIAL_STATE);
  const [isMobile, setIsMobile] = useState(false);
  const update = (patch: Partial<AppState>) => setS(prev => ({ ...prev, ...patch }));

  // ── Convex reactive queries ───────────────────────────────────────────────
  const convexWorkspaces = useQuery(api.workspaces.list);
  const convexProjects   = useQuery(api.projects.listAll);

  // เมื่อ Convex โหลดข้อมูลมาแล้ว → sync workspaces + projects เข้า local state
  useEffect(() => {
    if (!convexWorkspaces || !convexProjects) return;
    if (convexWorkspaces.length === 0) return;

    setS(prev => {
      const merged: Workspace[] = convexWorkspaces.map((cw) => {
        // หา local workspace ที่ match ด้วย _convexId
        const existing = prev.workspaces.find(w => w._convexId === cw._id);

        // ดึง projects ของ workspace นี้จาก Convex
        const cProjects = convexProjects.filter(cp => cp.workspaceId === cw._id);

        // Merge projects: เอา Convex เป็น source of truth สำหรับ fields
        // แต่เก็บ budgetCats จาก local (ยังไม่ sync budgetCats)
        const projects: Project[] = cProjects.map(cp => {
          const localPj = existing?.projects.find(p => p._convexId === cp._id);
          return {
            id:            localPj?.id ?? (cp._id as unknown as number),
            _convexId:     cp._id,
            name:          cp.name,
            approvalNo:    cp.approvalNo,
            controlPerson: cp.controlPerson,
            phone:         cp.phone,
            startDate:     cp.startDate
              ? new Date(cp.startDate).toISOString().split('T')[0]
              : '',
            budgetRef:     cp.budgetRef,
            division:      cp.division,
            totalBudget:   cp.totalBudget,
            status:        cp.status,
            budgetCats:    localPj?.budgetCats ?? [],
          };
        });

        return {
          id:          existing?.id ?? (cw._id as unknown as number),
          _convexId:   cw._id,
          name:        cw.name,
          year:        cw.year,
          dept:        cw.dept,
          totalBudget: cw.totalBudget,
          projects,
        };
      });

      const firstId = merged[0]?.id ?? prev.selectedWorkspaceId;
      const stillValid = merged.some(w => w.id === prev.selectedWorkspaceId);

      return {
        ...prev,
        workspaces:          merged,
        selectedWorkspaceId: stillValid ? prev.selectedWorkspaceId : firstId,
      };
    });
  }, [convexWorkspaces, convexProjects]);

  // ── Responsive ────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const ws = S.workspaces.find(w => w.id === S.selectedWorkspaceId);
  const pj = ws?.projects.find(p => p.id === S.selectedProjectId);

  const closeModal = () => update({
    showModal: null, editingCatId: null, editingTxId: null,
    targetCatId: null, editingDivId: null, viewingDivId: null, editingProjectId: null,
  });

  const modPj = (fn: (p: Project) => Project) => update({
    workspaces: S.workspaces.map(w =>
      w.id === S.selectedWorkspaceId
        ? { ...w, projects: w.projects.map(p => p.id === S.selectedProjectId ? fn(p) : p) }
        : w
    ),
  });

  const shared: SharedProps = { S, update, ws, pj, closeModal, modPj };

  if (isMobile) return <MobileApp {...shared} />;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'SaoChingcha', sans-serif", overflow: 'hidden', background: C.paper }}>
      <Sidebar {...shared} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {S.view === 'dashboard' && <DashboardView {...shared} />}
        {S.view === 'projects' && <ProjectsView {...shared} />}
        {S.view === 'project-detail' && <ProjectDetailView {...shared} />}
      </div>
      <Modals {...shared} />
    </div>
  );
}
