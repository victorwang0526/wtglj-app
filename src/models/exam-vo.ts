export interface Exam {
  areas: string;
  createDate: string;
  creator: number;
  dept: string;
  endDate: string;
  examDuration: string;
  examType: number;
  id: number;
  industries: string;
  moreChoiceItemScope: number;
  moreChoiceProportion: number;
  moreChoiceQuestions: number;
  moreChoiceScope: number;
  multipleChoiceItemScope: number;
  multipleChoiceProportion: number;
  multipleChoiceQuestions: number;
  multipleChoiceScope: number;
  name: string;
  passingScore: number;
  remark: string;
  startDate: string;
  status: number;
  totalScore: number;
  trueOrFalseItemScope: number;
  trueOrFalseProportion: number;
  trueOrFalseQuestions: number;
  trueOrFalseScope: number;
  type: number;
  updateDate: string;
  updater: number;
}

export interface Achievement {
  endTime: string;
  examPracticeId: number;
  id: number;
  itemList: AchievementItem[];
  respondentId: number;
  scope: number;
  startTime: string;
}

export interface AchievementItem {
  achievementId: number;
  answer: string;
  correctAnswer: string;
  examMasterId: number;
  id: number;
  isCorrect: number;
}

export interface Question {
  allCorrectAnswer: string;
  childType: string;
  correctAnswer: string;
  examType: number;
  id: number;
  isJudge: number;
  answer?: string[];
  examMasterId?: number;
  itemList: {
    allDescription: string;
    createDate: string;
    creator: number;
    description: string;
    examId: number;
    id: number;
    isAnswer: number;
    options: string;
    updateDate: string;
    updater: number;
    checked?: boolean;
  }[];
  sort: number;
  topic: string;
  type: string;
}

export interface Answer {
  endTime: Date; //结束时间
  examPracticeId: string; //考试Id
  respondentId: number; //答题用户Id
  startTime: Date; //开始时间
  itemList: {
    answer: string; //答案
    examMasterId: number; //题目Id
  }[];
}

export interface Practice {
  areas: string;
  createDate: string;
  creator: number;
  dept: string;
  endDate: string;
  examDuration: string;
  examType: string;
  id: number;
  industries: string;
  isStart: true;
  moreChoiceItemScope: number;
  moreChoiceProportion: number;
  moreChoiceQuestions: number;
  moreChoiceScope: number;
  multipleChoiceItemScope: number;
  multipleChoiceProportion: number;
  multipleChoiceQuestions: number;
  multipleChoiceScope: number;
  name: string;
  passingScore: number;
  remark: string;
  startDate: string;
  status: number;
  totalScore: number;
  trueOrFalseItemScope: number;
  trueOrFalseProportion: number;
  trueOrFalseQuestions: number;
  trueOrFalseScope: number;
  type: number;
  updateDate: string;
  updater: number;
}
