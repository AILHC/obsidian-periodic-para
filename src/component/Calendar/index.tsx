import * as React from 'react';
import { useApp } from '../../hooks/useApp';
import {
  Calendar as AntdCalendar,
  Badge,
  Checkbox,
  ConfigProvider,
  Drawer,
} from 'antd';
import { STask } from 'obsidian-dataview';

import type { Dayjs } from 'dayjs';
import type { BadgeProps, CalendarProps } from 'antd';
import type { Task } from '../../periodic/Task';
import type { PluginSettings } from '../../type';

import './index.less';
import { useState } from 'react';

const getTaskByDate = (task: Task, settings: PluginSettings) => {
  const tasksByDate: Record<string, any> = {};

  task.dataview
    .pages('')
    .file.tasks // .sort((t: STask) => t.completion, 'asc')
    .filter((task: STask) => {
      const inPeriodicNote =
        task.path.indexOf(settings?.periodicNotesPath) === 0;

      const isHabit =
        task?.section?.type === 'header' &&
        task?.section?.subpath?.trim() === settings?.habitHeader.trim();

      const isDone = task.completed === true;

      if (!inPeriodicNote || isHabit || isDone) {
        return false;
      }

      return true;
    })
    .map((task: STask) => {
      const date = getDateFromPath(task.path);
      if (!tasksByDate[date]) {
        tasksByDate[date] = [];
      }
      tasksByDate[date].push({
        ...task,
        type: 'success',
        content: task.text.replace(/^\d\d:\d\d/, '').replace(/\^.*$/, ''),
      });
    });

  return tasksByDate;
};

const getDateFromPath = (path: string): string => {
  const pathParts = path.split('/');
  const datePart = pathParts[pathParts.length - 1];
  return datePart.replace('.md', '');
};

const getListData = (value: Dayjs, tasksByDate: Record<string, any>) => {
  const key = value.format('YYYY-MM-DD');
  const listData = tasksByDate[key] || [];
  return listData;
};

export const Calendar = (props: { task: Task }) => {
  const { settings, locale } = useApp() || {};
  const { task } = props;
  const tasksByDate = getTaskByDate(task, settings!);
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value, tasksByDate);

    return (
      <ul onClick={() => showDrawer(listData)}>
        {listData.map((item: STask) => (
          <li key={item.content}>
            <Badge
              status={item.type as BadgeProps['status']}
              text={item.content}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-block',
                width: '100%',
              }}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);

    return info.originNode;
  };

  const [open, setOpen] = useState(false);
  const [data, setData] = useState<STask[]>([]);

  const showDrawer = (listData: STask[]) => {
    setOpen(true);
    setData(listData);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <ConfigProvider locale={locale}>
      <Drawer width={'30%'} title="Details" onClose={onClose} open={open}>
        {data.map((d) => (
          <Checkbox
            key={d.content}
            style={{
              paddingTop: 5,
              paddingBottom: 5,
              borderBottom: '1px gray dashed',
              width: '100%',
            }}
          >
            {d.content}
          </Checkbox>
        ))}
      </Drawer>
      <AntdCalendar cellRender={cellRender} />
    </ConfigProvider>
  );
};
