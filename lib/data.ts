import type { Workspace, FormState } from './types';

// ข้อมูลเริ่มต้น — ว่างเปล่า เพราะข้อมูลทั้งหมดโหลดจาก Convex Cloud
export const INITIAL_WORKSPACES: Workspace[] = [];

export const INITIAL_FORM: FormState = {
  wsName: '', wsYear: '2569', wsDept: 'กฟภ. สาขาย่อย เขต 1', wsBudget: '',
  pjName: '', pjApproval: '', pjControl: '', pjPhone: '', pjStart: '', pjRef: '', pjDiv: '', pjBudget: '', pjStatus: 'pending',
  bcName: '', bcCat: 'labor', bcAllocTotal: '', bcUsagePct: 100, bcDivisionId: null,
  txDesc: '', txAmount: '', txDate: '',
  divCode: '', divNetworkCode: '', divDesc: '',
};
