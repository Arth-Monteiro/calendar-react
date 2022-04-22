import ICalendar from "./ICalendar";
import IEvent from "./IEvent";

export type IEventWithCalendar = IEvent & { calendar: ICalendar };

export default interface ICalendarCell {
  date: string;
  dayOfMonth: number;
  events: IEventWithCalendar[];
}
