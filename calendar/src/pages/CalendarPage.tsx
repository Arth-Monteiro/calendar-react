import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Box,
  Button,
  IconButton,
  Avatar,
  Icon,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import IEvent from "../interfaces/IEvent";
import ICalendarCell from "../interfaces/ICalendarCell";

import { DAYS_OF_WEEK, generateWeeksFrom } from "../helpers/dateHelpers";
import { getAllCalendars, getEventsFilterByDate } from "../services/apiService";
import ICalendar from "../interfaces/ICalendar";

const borderColor = "1px solid rgb(224, 224, 224)";
const useStyles = makeStyles({
  table: {
    borderTop: borderColor,
    minHeight: "100%",
    tableLayout: "fixed",
    "& td ~ td, & th ~ th": {
      borderLeft: borderColor,
    },
    "& td": {
      verticalAlign: "top",
      overflow: "hidden",
      padding: "8px 4px",
    },
  },
  dayOfMonth: {
    display: "inline-block",
    fontWeight: 500,
    width: "24px",
    lineHeight: "24px",
    marginBottom: "4px",
    borderRadius: "50%",
    "&.today": {
      backgroundColor: "#3f51b5",
      color: "white",
    },
  },
  event: {
    display: "flex",
    alignItems: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    whiteSpace: "nowrap",
    margin: "4px 0",
  },
  eventBackground: {
    display: "inline-block",
    color: "white",
    padding: "2px 4px",
    borderRadius: "4px",
  },
});

export default function CalendarPage() {
  const [weeks, setWeeks] = useState<string[][]>(generateWeeksFrom(new Date("2021-06-17")));
  const [events, setEvents] = useState<IEvent[]>([]);
  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [calendarCells, setCalendarCells] = useState<ICalendarCell[][]>([]);

  const classes = useStyles();

  useEffect(() => {
    const cells: ICalendarCell[][] = weeks.map((ws) => {
      const week: ICalendarCell[] = ws.map((w) => {
        return {
          date: w,
          dayOfMonth: new Date(w).getDate(),
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

  useEffect(() => {
    const firstDate = weeks[0][0];
    const lastDate = weeks[weeks.length - 1][DAYS_OF_WEEK.length - 1];

    Promise.all([getAllCalendars(), getEventsFilterByDate(firstDate, lastDate)]).then(
      ([calendars, events]) => {
        setCalendars(calendars.map((c) => ({ ...c, isSelected: true })));
        setEvents(events);
      }
    );
  }, [weeks]);

  function toggleCalendar(index: number) {
    const updatedCalendars = [...calendars];
    updatedCalendars[index].isSelected = !updatedCalendars[index].isSelected;
    setCalendars(updatedCalendars);
  }

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      {/* Begin Calendar Selects Panel */}
      <Box borderRight={borderColor} width="12em" padding="8px 16px">
        <h2>Calendar React</h2>
        <Button variant="contained" color="primary">
          New Event
        </Button>

        <Box marginTop="64px">
          <h3>Calendars</h3>
          {calendars.map((calendar, index) => {
            return (
              <div>
                <FormControlLabel
                  key={calendar.id}
                  control={
                    <Checkbox
                      style={{ color: calendar.color }}
                      checked={calendar.isSelected}
                      onChange={() => toggleCalendar(index)}
                    />
                  }
                  label={calendar.name}
                />
              </div>
            );
          })}
        </Box>
      </Box>
      {/* End Calendar Selects Panel */}

      <Box flex="1" display="flex" flexDirection="column">
        <Box display="flex" alignItems="center" padding="8px 16px">
          {/* Begin Choose Month */}
          <Box>
            <IconButton aria-label="Previus Month">
              <Icon>chevron_left</Icon>
            </IconButton>
            <IconButton aria-label="Next Month">
              <Icon>chevron_right</Icon>
            </IconButton>
          </Box>
          {/* End Choose Month */}

          {/* Begin Name Month */}
          <Box flex="1" marginLeft="16px" component="h3">
            Abril de 2022
          </Box>
          {/* End Name Month */}

          {/* Begin Avatar Button */}
          <IconButton aria-label="User">
            <Avatar>
              <Icon>person</Icon>
            </Avatar>
          </IconButton>
          {/* End Avatar Button */}
        </Box>

        <TableContainer style={{ flex: "1" }} component={"div"}>
          {/* Begin Calendar Table */}
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                {DAYS_OF_WEEK.map((day) => (
                  <TableCell align="center" key={day}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {calendarCells.map((cells, index) => (
                <TableRow key={index}>
                  {cells.map((cell, index) => (
                    <TableCell align="center" key={index}>
                      <div className={classes.dayOfMonth}>{cell.dayOfMonth}</div>

                      {cell.events.map((event, index) => {
                        const color = event.calendar.color;
                        return (
                          <button className={classes.event} key={index}>
                            {event.time && (
                              <>
                                <Icon style={{ color }} fontSize="inherit">
                                  watch_later
                                </Icon>

                                <Box component="span" margin="0 4px">
                                  {event.time}
                                </Box>
                              </>
                            )}
                            {event.time ? (
                              <span>{event.desc}</span>
                            ) : (
                              <div className={classes.eventBackground}>{event.desc}</div>
                            )}
                          </button>
                        );
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* End Calendar Table */}
        </TableContainer>
      </Box>
    </Box>
  );
}
