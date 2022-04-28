import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useParams } from "react-router-dom";

import IEvent from "../interfaces/IEvent";
import ICalendarCell from "../interfaces/ICalendarCell";
import ICalendar from "../interfaces/ICalendar";

import CalendarsView from "../components/CalendarsView";
import CalendarsHeader from "../components/CalendarsHeader";
import CalendarsData from "../components/CalendarsData";

import { getAllCalendars, getEventsFilterByDate } from "../services/apiService";
import {
  DAYS_OF_WEEK,
  ISOStringToDate,
  generateWeeksFrom,
  dateToISOString,
  timeToISOString,
  TODAY,
} from "../helpers/dateHelpers";
import { borderColor } from "../components/CalendarsData";
import EventFormDialog from "../components/EventFormDialog";
import IUser from "../interfaces/IUser";

interface ICalendarPageProp {
  user: IUser;
  onSignOut: () => void;
}

export default function CalendarPage({ user, onSignOut }: ICalendarPageProp) {
  const { period } = useParams<{ period: string }>();

  const currentPeriod = ISOStringToDate(`${period}-01`);

  const weeks = generateWeeksFrom(currentPeriod);
  const firstDate = weeks[0][0];
  const lastDate = weeks[weeks.length - 1][DAYS_OF_WEEK.length - 1];

  const [events, setEvents] = useState<IEvent[]>([]);
  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [calendarCells, setCalendarCells] = useState<ICalendarCell[][]>([]);
  const [event, setEvent] = useState<IEvent | null>(null);

  // Generate de Calendar Cells (events and calendars)
  useEffect(() => {
    const cells: ICalendarCell[][] = weeks.map((ws) => {
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
    setCalendarCells(cells);
  }, [calendars, events, weeks]);

  // Get the calendars and the events
  useEffect(() => {
    Promise.all([getAllCalendars(), getEventsFilterByDate(firstDate, lastDate)]).then(
      ([calendars, events]) => {
        setCalendars(calendars.map((c) => ({ ...c, isSelected: true })));
        setEvents(events);
      }
    );
  }, [firstDate, lastDate]);

  function toggleCalendar(index: number) {
    const updatedCalendars = [...calendars];
    updatedCalendars[index].isSelected = !updatedCalendars[index].isSelected;
    setCalendars(updatedCalendars);
  }

  function handleOpenDialog(event?: IEvent | null, date?: string) {
    if (!event) {
      event = {
        id: "0",
        date: date ?? dateToISOString(TODAY),
        time: date ? "00:00" : timeToISOString(TODAY),
        desc: "",
        calendarId: calendars[0].id,
      };
    }
    setEvent(event);
  }

  function handleCancelDialog() {
    setEvent(null);
  }

  async function handleSaveDialog() {
    const updatedEvents = await getEventsFilterByDate(firstDate, lastDate);
    setEvents(updatedEvents);
  }

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      {/* Begin Calendar Selects Panel */}
      <Box borderRight={borderColor} width="12em" padding="8px 16px">
        <h2>Calendar React</h2>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          New Event
        </Button>

        <CalendarsView calendars={calendars} onChange={toggleCalendar} />
      </Box>
      {/* End Calendar Selects Panel */}

      <Box flex="1" display="flex" flexDirection="column">
        <CalendarsHeader currentPeriod={currentPeriod} user={user} onSignOut={onSignOut} />

        <CalendarsData
          calendarCells={calendarCells}
          onClickDay={(date) => handleOpenDialog(null, date)}
          onClickEvent={(event) => handleOpenDialog(event)}
        />

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
