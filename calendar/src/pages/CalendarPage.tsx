import { useEffect, useReducer, useMemo, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { useParams } from "react-router-dom";

import IEvent from "../interfaces/IEvent";
import ICalendarCell from "../interfaces/ICalendarCell";
import ICalendar from "../interfaces/ICalendar";

import { CalendarsView } from "../components/CalendarsView";
import { CalendarsHeader } from "../components/CalendarsHeader";
import { CalendarsData, borderColor } from "../components/CalendarsData";
import { EventFormDialog } from "../components/EventFormDialog";

import calendarPageReducer from "../reducers/CalendarPageReducer";

import { getAllCalendars, getEventsFilterByDate } from "../services/apiService";
import { DAYS_OF_WEEK, ISOStringToDate } from "../helpers/dateHelpers";
import { generateWeeksFrom } from "../helpers/dateHelpers";

function useCalendarPageState(period: string) {
  const [{ calendars, events, event }, dispatch] = useReducer(calendarPageReducer, {
    calendars: [],
    events: [],
    event: null,
  });

  const [calendarCells, firstDate, lastDate, currentPeriod] = useMemo(() => {
    const currentPeriod = ISOStringToDate(`${period}-01`);
    const weeks = generateWeeksFrom(currentPeriod);
    const firstDate = weeks[0][0];
    const lastDate = weeks[weeks.length - 1][DAYS_OF_WEEK.length - 1];

    const calendarCells = generateCalendarCells(weeks, calendars, events);

    return [calendarCells, firstDate, lastDate, currentPeriod];
  }, [calendars, events, period]);

  // Get the calendars and the events
  useEffect(() => {
    Promise.all([getEventsFilterByDate(firstDate, lastDate), getAllCalendars()]).then(
      ([events, calendars]) => {
        dispatch({ type: "load", payload: { events, calendars } });
      }
    );
  }, [firstDate, lastDate]);

  const handleCancelDialog = useCallback(() => {
    dispatch({ type: "closeDialog" });
  }, []);

  const handleSaveDialog = useCallback(async () => {
    const updatedEvents = await getEventsFilterByDate(firstDate, lastDate);
    dispatch({ type: "load", payload: { events: updatedEvents } });
  }, [firstDate, lastDate]);

  return {
    currentPeriod,
    calendarCells,
    calendars,
    event,
    dispatch,
    handleCancelDialog,
    handleSaveDialog,
  };
}

export default function CalendarPage() {
  const { period } = useParams<{ period: string }>();

  const {
    currentPeriod,
    calendarCells,
    calendars,
    event,
    dispatch,
    handleCancelDialog,
    handleSaveDialog,
  } = useCalendarPageState(period!);

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      {/* Begin Calendar Selects Panel */}
      <Box borderRight={borderColor} width="12em" padding="8px 16px">
        <h2>Calendar React</h2>
        <Button variant="contained" color="primary" onClick={() => dispatch({ type: "newDialog" })}>
          New Event
        </Button>

        <CalendarsView calendars={calendars} dispatch={dispatch} />
      </Box>
      {/* End Calendar Selects Panel */}

      <Box flex="1" display="flex" flexDirection="column">
        <CalendarsHeader currentPeriod={currentPeriod} />

        <CalendarsData calendarCells={calendarCells} dispatch={dispatch} />

        <EventFormDialog
          id={"eventDialogForm"}
          onCancel={handleCancelDialog}
          onSave={() => {
            handleCancelDialog();
            handleSaveDialog();
          }}
          event={event}
          calendars={calendars}
        />
      </Box>
    </Box>
  );
}

// Generate de Calendar Cells (events and calendars)
function generateCalendarCells(
  weeks: string[][],
  calendars: ICalendar[],
  events: IEvent[]
): ICalendarCell[][] {
  return weeks.map((ws) => {
    const week: ICalendarCell[] = ws.map((w) => {
      return {
        date: w,
        dayOfMonth: new Date(ISOStringToDate(w)).getDate(),
        events: events
          .filter((e) => e.date === w)
          .map((e) => {
            const calendar = calendars.find((cal) => cal.id === e.calendarId)!;
            return { ...e, calendar };
          })
          .filter((e) => e.calendar.isSelected),
      };
    });
    return week;
  });
}
