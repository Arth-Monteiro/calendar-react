import { create, edit, exclude, read } from "./httpService";

import ICalendar from "../interfaces/ICalendar";
import IEvent from "../interfaces/IEvent";
import { getNewId } from "./idService";

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

export async function apiCreateEvent(event: IEvent): Promise<IEvent> {
  const newEvent = await create("/events", {
    ...event,
    id: getNewId(),
  });
  return newEvent as IEvent;
}

export async function apiUpdateEvent(event: IEvent): Promise<IEvent> {
  const updatedEvent = await edit(`/events/${event.id}`, { ...event });
  return updatedEvent as IEvent;
}

export async function apiDeleteEvent(eventId: string) {
  await exclude(`/events/${eventId}`);
}
