import { ko_KR } from 'ng-zorro-antd/i18n';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import ko from '@fullcalendar/core/locales/ko';

import { createEventId, INITIAL_EVENTS } from './event-util';

@Component({
  selector: 'app-calendar-fullcalendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `
    <full-calendar [options]='calendarOptions()'>
      <ng-template #eventContent let-arg>
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </ng-template>
    </full-calendar>
  `,
  styles: `
    :host {
      --main-page-bg-color: #211e21;
      --fc-small-font-size: .85em;
      --fc-page-bg-color: #3e2f3f;
      --fc-neutral-bg-color: #2c000631;
      --fc-neutral-text-color: #808080;
      --fc-border-color: #464646;

      --fc-button-text-color: #fff;
      --fc-button-bg-color: #2e807d;
      --fc-button-border-color: #2e807d;
      --fc-button-hover-bg-color: #256b69;
      --fc-button-hover-border-color: #184746;
      --fc-button-active-bg-color: #184746;
      --fc-button-active-border-color: #142b2a;

      --fc-event-bg-color: #007e79;
      --fc-event-border-color: #007e79;
      --fc-event-text-color: #fff;
      --fc-event-selected-overlay-color: rgba(0, 0, 0, 0.25);

      --fc-more-link-bg-color: #d0d0d0;
      --fc-more-link-text-color: inherit;

      --fc-event-resizer-thickness: 8px;
      --fc-event-resizer-dot-total-width: 8px;
      --fc-event-resizer-dot-border-width: 1px;

      --fc-non-business-color: rgba(215, 215, 215, 0.3);
      --fc-bg-event-color: rgb(143, 223, 130);
      --fc-bg-event-opacity: 0.3;
      --fc-highlight-color: rgba(188, 232, 241, 0.3);
      --fc-today-bg-color: #c9006425;
      --fc-now-indicator-color: red;
    }

    .fc { /* the calendar root */
      height: calc(100vh - 244px);
      margin: 0 auto;
    }

    a.fc-event.fc-daygrid-event[href] {
      color: #c90064;
    }

    a.fc-event.fc-daygrid-event[href]:visited {
      color: #9c3dd3;
    }

    .fc .fc-daygrid-day.fc-day-other {
      background: var(--fc-neutral-bg-color);
    }

    .fc .fc-scrollgrid-section-sticky > * {
      background: unset;
      position: sticky;
      z-index: 3;
    }

    :not(td[aria-labelledby]) > .fc-daygrid-day-frame {
      background: var(--fc-neutral-bg-color);
    }

    .fc .fc-scrollgrid-section-body {
      background: var(--fc-page-bg-color);
    }

    .fc .fc-timegrid-slot-label, .fc .fc-timegrid-axis-frame {
      background-color: var(--main-page-bg-color);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarFullcalendarComponent {

  calendarOptions = signal<CalendarOptions>({
    locale: 'ko',
    //themeSystem: 'bootstrap5',
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }
}
