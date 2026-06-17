import type { CatKey, StatusKey } from './constants';

export interface Transaction {
  id: number;
  desc: string;
  amount: number;
  date: string;
}

export interface BudgetCat {
  id: number;
  cat: CatKey;
  name: string;
  allocTotal: number;
  usagePct: number;
  divisionId?: number | null;
  transactions: Transaction[];
}

export interface Division {
  id: number;
  code: string;
  networkCode: string;
  desc: string;
}

export interface Project {
  id: number;
  name: string;
  approvalNo: string;
  controlPerson: string;
  phone: string;
  startDate: string;
  budgetRef: string;
  division: string;
  status: StatusKey;
  totalBudget: number;
  divisions?: Division[];
  budgetCats: BudgetCat[];
}

export interface Workspace {
  id: number;
  name: string;
  year: number;
  dept: string;
  totalBudget: number;
  projects: Project[];
}

export interface FormState {
  wsName: string; wsYear: string; wsDept: string; wsBudget: string;
  pjName: string; pjApproval: string; pjControl: string; pjPhone: string;
  pjStart: string; pjRef: string; pjDiv: string; pjBudget: string;
  bcName: string; bcCat: CatKey; bcAllocTotal: string; bcUsagePct: number; bcDivisionId: number | null;
  txDesc: string; txAmount: string; txDate: string;
  divCode: string; divNetworkCode: string; divDesc: string;
}

export interface AppState {
  view: 'dashboard' | 'projects' | 'project-detail';
  selectedWorkspaceId: number;
  selectedProjectId: number | null;
  showModal: string | null;
  editingCatId: number | null;
  editingTxId: number | null;
  targetCatId: number | null;
  editingDivId: number | null;
  viewingDivId: number | null;
  selectedDivisionId: number | null;
  filterStatus: string;
  activeBudgetCat: string;
  activeBudgetStatus: string;
  collapsedCats: Record<number, boolean>;
  searchQuery: string;
  showWsDropdown: boolean;
  form: FormState;
  workspaces: Workspace[];
}
