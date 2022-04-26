import { Box, FormControlLabel, Checkbox } from "@mui/material";
import ICalendar from "../interfaces/ICalendar";

interface ICalendarsViewProp {
  calendars: ICalendar[];
  onChange: (index: number) => void;
}

export default function CalendarsView({ calendars, onChange }: ICalendarsViewProp) {
  function toggleCalendar(index: number) {
    if (onChange) {
      onChange(index);
    }
  }

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
                  onChange={() => toggleCalendar(index)}
                />
              }
              label={calendar.name}
            />
          </div>
        );
      })}
    </Box>
  );
}
