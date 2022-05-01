import { dateToISOString, TODAY, timeToISOString } from "../helpers/dateHelpers";
import ICalendar from "../interfaces/ICalendar";
import IEvent from "../interfaces/IEvent";

export interface ICalendarPageState {
  calendars: ICalendar[];
  events: IEvent[];
  event: IEvent | null;
}

export type ICalendarPageAction =
  | {
      type: "load";
      payload: { events: IEvent[]; calendars?: ICalendar[] };
    }
  | {
      type: "edit";
      payload: IEvent;
    }
  | {
      type: "newDialog";
      payload?: string;
    }
  | {
      type: "closeDialog";
    }
  | {
      type: "toggleCalendar";
      payload: number;
    };

export default function calendarPageReducer(
  state: ICalendarPageState,
  action: ICalendarPageAction
): ICalendarPageState {
  switch (action.type) {
    case "load":
      return {
        ...state,
        events: action.payload.events,
        calendars:
          action.payload.calendars !== undefined
            ? action.payload.calendars.map((c) => ({ ...c, isSelected: true }))
            : state.calendars,
      };

    case "edit":
      return { ...state, event: action.payload };

    case "newDialog":
      const newEvent = {
        id: "0",
        date: action.payload ?? dateToISOString(TODAY),
        time: action.payload ? "00:00" : timeToISOString(TODAY),
        desc: "",
        calendarId: state.calendars[0].id,
      };
      return { ...state, event: newEvent };

    case "closeDialog":
      return { ...state, event: null };

    case "toggleCalendar":
      const calendars = [...state.calendars];
      calendars[action.payload].isSelected = !calendars[action.payload].isSelected;
      return { ...state, calendars };

    default:
      return state;
  }
}
