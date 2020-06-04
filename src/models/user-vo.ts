import {DeptVo} from "./dept-vo";

export class UserVo {
  id: number;
  realName: string;
  avatar: string;
  username: string;
  mobile: string;
  dept: string;
  duty: string;
  industries: string;
  areas: string;
  status: number;

  password: string;
  confirmPassword: string;

  deptDTO: DeptVo;
}
