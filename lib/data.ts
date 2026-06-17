import type { Workspace, FormState } from './types';

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 1, name: 'งบประมาณ 2568', year: 2568, dept: 'กฟภ. สาขาย่อย เขต 1', totalBudget: 5800000,
    projects: [
      {
        id: 1, name: 'งาน กฟร.99 สาย 6 หาง ศรีวิไล', approvalNo: 'ศก(333) 66/69',
        controlPerson: 'นายสมชาย วงค์ทอง', phone: '0038005260957', startDate: '20 มิ.ย. 69',
        budgetRef: 'C-69-B-TAK-CS-7009.01.9', division: '103ช่', status: 'active', totalBudget: 280000,
        divisions: [
          { id: 1, code: 'HT-C-E', networkCode: '8005204581', desc: 'แรงสูง-โยธา-ไฟฟ้า' },
          { id: 2, code: 'LT-C-E', networkCode: '8005204582', desc: 'แรงต่ำ-โยธา-ไฟฟ้า' },
          { id: 3, code: 'TR-C-E', networkCode: '8005204583', desc: 'หม้อแปลง-โยธา-ไฟฟ้า' },
        ],
        budgetCats: [
          { id: 1, cat: 'labor', name: 'ค่าแรงรวม', allocTotal: 9340, usagePct: 100, divisionId: 1,
            transactions: [{ id: 101, desc: 'เบิกค่าแรง งวด 1', amount: 9993, date: '25 มิ.ย. 69' }] },
          { id: 2, cat: 'supervision', name: 'ค่าควบคุมงาน', allocTotal: 2802, usagePct: 100, divisionId: 1,
            transactions: [
              { id: 201, desc: 'เบิกค่าควบคุม งวด 1', amount: 755, date: '22 มิ.ย. 69' },
              { id: 202, desc: 'เบิกค่าควบคุม งวด 2', amount: 2047, date: '30 มิ.ย. 69' },
            ] },
          { id: 3, cat: 'transport', name: 'ค่าขนส่ง', allocTotal: 960, usagePct: 80, divisionId: 2, transactions: [] },
          { id: 4, cat: 'misc', name: 'เบ็ดเตล็ดทั่วไป', allocTotal: 1615, usagePct: 100, divisionId: 3, transactions: [] },
        ],
      },
      {
        id: 2, name: 'งานขยายเขต ต.หนองบัว', approvalNo: 'ศก(225) 44/68',
        controlPerson: 'นายวิชิต ศรีสมบัติ', phone: '0891234567', startDate: '15 มี.ค. 68',
        budgetRef: 'C-68-B-NNG-CS-5001.02.3', division: '87ช่', status: 'completed', totalBudget: 420000,
        budgetCats: [
          { id: 5, cat: 'labor', name: 'ค่าแรงรวม', allocTotal: 45000, usagePct: 100,
            transactions: [
              { id: 501, desc: 'เบิกค่าแรงงาน ครั้งที่ 1', amount: 22000, date: '10 มี.ค. 68' },
              { id: 502, desc: 'เบิกค่าแรงงาน ครั้งที่ 2', amount: 23000, date: '25 มี.ค. 68' },
            ] },
          { id: 6, cat: 'supervision', name: 'ค่าควบคุมงาน', allocTotal: 18000, usagePct: 100,
            transactions: [{ id: 601, desc: 'เบิกค่าควบคุม', amount: 18000, date: '12 มี.ค. 68' }] },
          { id: 7, cat: 'transport', name: 'ค่าขนส่ง', allocTotal: 8500, usagePct: 100,
            transactions: [{ id: 701, desc: 'ค่าขนส่งวัสดุ', amount: 8500, date: '15 มี.ค. 68' }] },
        ],
      },
      {
        id: 3, name: 'งานปรับปรุงระบบไฟฟ้า ถ.สุขุมวิท กม.12', approvalNo: 'ศก(101) 12/69',
        controlPerson: 'นายพิทักษ์ เจริญสุข', phone: '0851234567', startDate: '01 ส.ค. 69',
        budgetRef: 'C-69-A-SKW-IM-3301.01.1', division: '45ช่', status: 'pending', totalBudget: 185000, budgetCats: [],
      },
      {
        id: 4, name: 'งานติดตั้งหม้อแปลงใหม่ หมู่ 3 ต.ท่าโสม', approvalNo: 'ศก(087) 78/69',
        controlPerson: 'นายเดชา ลำธาร', phone: '0819876543', startDate: '10 ก.ย. 69',
        budgetRef: 'C-69-C-HM3-EL-8801.03.2', division: '22ช่', status: 'cancelled', totalBudget: 95000, budgetCats: [],
      },
    ],
  },
  {
    id: 2, name: 'งบประมาณ 2567', year: 2567, dept: 'กฟภ. สาขาย่อย เขต 1', totalBudget: 4200000,
    projects: [
      {
        id: 10, name: 'งานขยายเขตฯ ต.โนนสูง', approvalNo: 'ศก(115) 32/67',
        controlPerson: 'นายอำนาจ ดวงแก้ว', phone: '0871234567', startDate: '05 เม.ย. 67',
        budgetRef: 'C-67-A-NS-CS-2201.01.5', division: '55ช่', status: 'completed', totalBudget: 320000,
        budgetCats: [
          { id: 11, cat: 'labor', name: 'ค่าแรงรวม', allocTotal: 55000, usagePct: 100,
            transactions: [{ id: 1101, desc: 'เบิกค่าแรงงาน', amount: 55000, date: '20 เม.ย. 67' }] },
          { id: 12, cat: 'supervision', name: 'ค่าควบคุมงาน', allocTotal: 22000, usagePct: 100,
            transactions: [{ id: 1201, desc: 'เบิกค่าควบคุม', amount: 22000, date: '22 เม.ย. 67' }] },
          { id: 13, cat: 'transport', name: 'ค่าขนส่ง', allocTotal: 7200, usagePct: 100,
            transactions: [{ id: 1301, desc: 'ค่าขนส่งวัสดุ', amount: 7200, date: '25 เม.ย. 67' }] },
        ],
      },
    ],
  },
];

export const INITIAL_FORM: FormState = {
  wsName: '', wsYear: '2569', wsDept: 'กฟภ. สาขาย่อย เขต 1', wsBudget: '',
  pjName: '', pjApproval: '', pjControl: '', pjPhone: '', pjStart: '', pjRef: '', pjDiv: '', pjBudget: '',
  bcName: '', bcCat: 'labor', bcAllocTotal: '', bcUsagePct: 100, bcDivisionId: null,
  txDesc: '', txAmount: '', txDate: '',
  divCode: '', divNetworkCode: '', divDesc: '',
};
