import { FormEvent, useEffect, useRef, useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import ICalendar from "../interfaces/ICalendar";
import IEvent from "../interfaces/IEvent";
import IErrors from "../interfaces/IErrors";

import { getNewId } from "../services/idService";
import { apiCreateEvent, apiDeleteEvent, apiUpdateEvent } from "../services/apiService";

interface IEventFormDialogProp {
  id: string;
  calendars: ICalendar[];
  event: IEvent | null;
  onCancel: () => void;
  onSave: () => void;
}

export default function EventFormDialog({
  id,
  calendars,
  event: receiveEvent,
  onCancel,
  onSave,
}: IEventFormDialogProp) {
  id += "-" + getNewId();

  const [event, setEvent] = useState<IEvent | null>(receiveEvent);
  const [errors, setErrors] = useState<IErrors>({});

  const inputDate = useRef<HTMLInputElement | null>();
  const inputDesc = useRef<HTMLInputElement | null>();

  useEffect(() => {
    setEvent(receiveEvent);
    setErrors({});
  }, [receiveEvent]);

  function saveEvent(evt: FormEvent) {
    evt.preventDefault();
    if (event && validate()) {
      if (event.id === "0") {
        apiCreateEvent(event!);
      } else {
        apiUpdateEvent(event!);
      }
      onSave();
    }
  }

  function handleRemoveEvent() {
    apiDeleteEvent(event?.id!);
    onSave();
  }

  function validate(): boolean {
    if (event) {
      const currentErrors: IErrors = {};
      if (!event.date) {
        currentErrors["date"] = "Date must be filled";
        inputDate.current?.focus();
      }
      if (!event.desc) {
        currentErrors["desc"] = "Description must be filled";
        inputDesc.current?.focus();
      }
      setErrors(currentErrors);
      return Object.keys(currentErrors).length === 0;
    }
    return false;
  }

  const title = event?.id !== "0" ? "Edit Event" : "New Event";

  return (
    <div>
      {event && (
        <>
          <Dialog open={!!event} onClose={onCancel}>
            <form onSubmit={saveEvent}>
              <DialogTitle>{title}</DialogTitle>
              <DialogContent>
                <TextField
                  inputRef={inputDate}
                  id={`${id}-date`}
                  label="Date"
                  type="date"
                  value={event.date}
                  margin="normal"
                  fullWidth
                  onChange={(evt) => setEvent({ ...event, date: evt.target.value })}
                  error={!!errors.date}
                  helperText={errors.date}
                />
                <TextField
                  inputRef={inputDesc}
                  id={`${id}-description`}
                  label="Description"
                  margin="normal"
                  value={event.desc}
                  fullWidth
                  autoFocus
                  onChange={(evt) => setEvent({ ...event, desc: evt.target.value })}
                  error={!!errors.desc}
                  helperText={errors.desc}
                />
                <TextField
                  id={`${id}-time`}
                  label="Time"
                  type="time"
                  value={event.time ?? ""}
                  margin="normal"
                  fullWidth
                  onChange={(evt) => setEvent({ ...event, time: evt.target.value })}
                />
                <FormControl margin="normal" fullWidth>
                  <InputLabel id={`${id}-calendar`}>Calendar</InputLabel>
                  <Select
                    labelId={`${id}-calendar`}
                    id={`${id}-select`}
                    value={event.calendarId}
                    onChange={(evt) =>
                      setEvent({ ...event, calendarId: evt.target.value as number })
                    }
                  >
                    {calendars.map((calendar) => {
                      return (
                        <MenuItem key={calendar.id} value={calendar.id}>
                          {calendar.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                {event.id !== "0" ? (
                  <Button type="button" onClick={handleRemoveEvent}>
                    Remove
                  </Button>
                ) : (
                  <></>
                )}
                <Button type="button" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" onClick={onSave} color="primary">
                  Save
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </>
      )}
    </div>
  );
}
