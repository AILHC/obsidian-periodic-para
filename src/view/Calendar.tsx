import { ItemView, WorkspaceLeaf, debounce } from 'obsidian';
import * as React from 'react';
import { type Root, createRoot } from 'react-dom/client';
import type { Locale } from 'antd/es/locale';
import { Calendar } from '../component/Calendar';
import { AppContext } from '../context';
import type { PluginSettings } from '../type';
import type { Task } from '../periodic/Task';

export const CALENDAR = 'periodic-para-calendar';

export class CalendarView extends ItemView {
  settings: PluginSettings;
  root: Root;
  task: Task;
  locale: Locale;
  constructor(
    leaf: WorkspaceLeaf,
    settings: PluginSettings,
    locale: Locale,
    task: Task
  ) {
    super(leaf);
    this.settings = settings;
    this.task = task;
    this.locale = locale;
  }

  getViewType() {
    return CALENDAR;
  }

  getDisplayText() {
    return 'Periodic PARA Calendar';
  }

  getIcon(): string {
    return 'calendar';
  }

  onResize = debounce(async () => {
    this.onClose();
    this.onOpen();
  }, 500);

  async onOpen() {
    this.contentEl.empty();
    this.contentEl.addClass('periodic-para-calendar');
    this.root = createRoot(this.containerEl.children[1]);
    this.root.render(
      <AppContext.Provider
        value={{
          app: this.app,
          settings: this.settings,
          locale: this.locale,
        }}
      >
        <Calendar task={this.task} />
      </AppContext.Provider>
    );
  }

  async onClose() {
    this.root.unmount();
  }
}
