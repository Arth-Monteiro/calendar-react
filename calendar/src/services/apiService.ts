import { create, edit, exclude, read } from "./httpService";

import ICalendar from "../interfaces/ICalendar";
import IEvent from "../interfaces/IEvent";
import { getNewId } from "./idService";
import IUser from "../interfaces/IUser";

export async function getAllCalendars(): Promise<ICalendar[]> {
  try {
    const calendars = await read("/calendars");
    return calendars as ICalendar[];
  } catch (e) {
    return [{ id: 0, name: "Error", color: "#FF0000" }] as ICalendar[];
  }
}

export async function getAllEvents(): Promise<IEvent[]> {
  try {
    const events = await read("/events");
    return events as IEvent[];
  } catch (e) {
    return [{}] as IEvent[];
  }
}

export async function getEventsFilterByDate(from: string, to: string): Promise<IEvent[]> {
  try {
    const events = await read(`/events?date_gte=${from}&date_lte=${to}&_sort=date,time`);
    return events as IEvent[];
  } catch (e) {
    return [{}] as IEvent[];
  }
}

export async function apiCreateEvent(event: IEvent): Promise<IEvent> {
  try {
    const newEvent = await create("/events", {
      ...event,
      id: getNewId(),
    });
    return newEvent as IEvent;
  } catch (e) {
    return {} as IEvent;
  }
}

export async function apiUpdateEvent(event: IEvent): Promise<IEvent> {
  try {
    const updatedEvent = await edit(`/events/${event.id}`, { ...event });
    return updatedEvent as IEvent;
  } catch (e) {
    return {} as IEvent;
  }
}

export async function apiDeleteEvent(eventId: string) {
  await exclude(`/events/${eventId}`);
}

export async function apiCheckAuthUser(): Promise<IUser | null> {
  try {
    const user = await read("/auth/user");
    return user as IUser;
  } catch (e) {
    return null;
  }
}

export async function apiMakeLogin(email: string, pwd: string): Promise<IUser | null> {
  try {
    const userLogin = await create("/auth/login", { email: email, password: pwd });
    return userLogin as IUser;
  } catch (e) {
    return null;
  }
}

export async function apiMakeLogout(): Promise<Object | null> {
  try {
    const userLogut = await create("/auth/logout", {});
    return userLogut;
  } catch (e) {
    return null;
  }
}
