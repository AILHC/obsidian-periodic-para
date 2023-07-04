export interface PluginSettings {
  periodicNotesPath: string;
}

export type DateType = {
  year: number | null;
  month: number | null;
  quarter: number | null;
  week: number | null;
  day: number | null;
};

export type DateRangeType = {
  from: string | null;
  to: string | null;
};

export enum TaskStatusType {
  DONE = 'DONE',
  RECORD = 'RECORD',
}

export type TaskConditionType = {
  date?: TaskStatusType;
  from?: string | null;
  to?: string | null;
};
