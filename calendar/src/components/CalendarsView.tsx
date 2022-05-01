import { Dispatch, memo } from "react";
import { Box, FormControlLabel, Checkbox } from "@mui/material";
import ICalendar from "../interfaces/ICalendar";
import { ICalendarPageAction } from "../reducers/CalendarPageReducer";

interface ICalendarsViewProp {
  calendars: ICalendar[];
  dispatch: Dispatch<ICalendarPageAction>;
}

export const CalendarsView = memo(({ calendars, dispatch }: ICalendarsViewProp) => {
  return (
    <Box marginTop="64px">
      <h3>Calendars</h3>
      {calendars.map((calendar, index) => {
        return (
          <div key={calendar.id}>
            <FormControlLabel
              control={
                <Checkbox
                  style={{ color: calendar.color }}
                  checked={calendar.isSelected}
                  onChange={() => dispatch({ type: "toggleCalendar", payload: index })}
                />
              }
              label={calendar.name}
            />
          </div>
        );
      })}
    </Box>
  );
});
