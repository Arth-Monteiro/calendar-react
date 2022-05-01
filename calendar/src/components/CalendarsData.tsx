import { Dispatch, memo, MouseEvent } from "react";

import { Box, Icon } from "@mui/material";
import { Table } from "@mui/material";
import { TableBody } from "@mui/material";
import { TableCell } from "@mui/material";
import { TableContainer } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { makeStyles } from "@material-ui/styles";

import ICalendarCell from "../interfaces/ICalendarCell";
import IEvent from "../interfaces/IEvent";

import { dateToISOString, DAYS_OF_WEEK, TODAY } from "../helpers/dateHelpers";
import { ICalendarPageAction } from "../reducers/CalendarPageReducer";

export const borderColor = "1px solid rgb(224, 224, 224)";
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

interface ICalendarsDataProp {
  calendarCells: ICalendarCell[][];
  dispatch: Dispatch<ICalendarPageAction>;
}

export const CalendarsData = memo(({ calendarCells, dispatch }: ICalendarsDataProp) => {
  const classes = useStyles();

  function handleDayClick(evt: MouseEvent, date: string) {
    if (evt.target === evt.currentTarget) {
      dispatch({ type: "newDialog", payload: date });
    }
  }

  function handleEventClick(event: IEvent) {
    dispatch({ type: "edit", payload: event });
  }

  return (
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
                <TableCell
                  align="center"
                  key={index}
                  onClick={(evt) => handleDayClick(evt, cell.date)}
                >
                  <div
                    onClick={(evt) => handleDayClick(evt, cell.date)}
                    className={
                      classes.dayOfMonth + (cell.date === dateToISOString(TODAY) ? " today" : "")
                    }
                  >
                    {cell.dayOfMonth}
                  </div>

                  {cell.events.map((event, index) => {
                    const color = event.calendar.color;
                    return (
                      <button
                        className={classes.event}
                        key={index}
                        onClick={() => handleEventClick(event)}
                      >
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
                          <span
                            className={classes.eventBackground}
                            style={{ backgroundColor: color }}
                          >
                            {event.desc}
                          </span>
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
  );
});
