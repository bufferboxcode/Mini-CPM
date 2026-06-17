export const C = {
  sb: '#1C0A42', sbMid: '#2A1258',
  deep: '#2E1460', primary: '#6B3FA0', mid: '#9264C4',
  pale: '#D5C2ED', ghost: '#EDE4F8', paper: '#F7F3FC', white: '#FFFFFF',
  text: '#1D1340', sub: '#7A7098', line: '#EAE0F5',
  green: '#2DB87A', greenBg: '#E4F7EF',
  orange: '#D97B22', orangeBg: '#FEF0DC',
  red: '#C94545', redBg: '#FDEAEA',
  blue: '#4A8DE8', blueBg: '#EAF0FF',
} as const;

export const statusCfg = {
  active:    { label: 'กำลังดำเนินการ', color: C.green,  bg: C.greenBg },
  completed: { label: 'เสร็จสมบูรณ์',   color: C.blue,   bg: C.blueBg },
  pending:   { label: 'รอดำเนินการ',     color: C.orange, bg: C.orangeBg },
  cancelled: { label: 'ยกเลิก',          color: C.red,    bg: C.redBg },
} as const;

export const catCfg = {
  labor:       { label: 'ค่าแรง',    color: C.primary, bg: C.ghost },
  supervision: { label: 'ค่าควบคุม', color: C.blue,    bg: C.blueBg },
  transport:   { label: 'ค่าขนส่ง',  color: C.orange,  bg: C.orangeBg },
  misc:        { label: 'เบ็ดเตล็ด', color: C.red,     bg: C.redBg },
} as const;

export type CatKey = keyof typeof catCfg;
export type StatusKey = keyof typeof statusCfg;
