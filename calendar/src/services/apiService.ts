import { read } from "./httpService";

import ICalendar from "../interfaces/ICalendar";
import IEvent from "../interfaces/IEvent";

export async function getAllCalendars(): Promise<ICalendar[]> {
  const calendars = await read("/calendars");
  return calendars as ICalendar[];
}

export async function getAllEvents(): Promise<IEvent[]> {
  const events = await read("/events");
  return events as IEvent[];
}

export async function getEventsFilterByDate(from: string, to: string): Promise<IEvent[]> {
  const events = await read(`/events?date_gte=${from}&date_lte=${to}&_sort=date,time`);
  return events as IEvent[];
}
