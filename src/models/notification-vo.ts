export interface Notification {
  createDate: string;
  id: number;
  noticeDTO: Notice;
  noticeId: number;
  status: number;
  userId: number;
}

export interface Notice {
  areas: string;
  context: string;
  createDate: string;
  creator: number;
  dept: string;
  deptName: string;
  fileDto: File[];
  fileName: string;
  filePath: string;
  id: number;
  industries: string;
  isSend: number;
  sendDate: string;
  title: string;
  type: number;
  updateDate: string;
  updater: number;
}

export interface File {
  name: string;
  path: string;
}
