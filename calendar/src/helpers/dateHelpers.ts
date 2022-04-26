export const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// export const TODAY = new Date();
export const TODAY = new Date("2021-06-17T12:43:32");

export function dateToISOString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function timeToISOString(time: Date): string {
  const hour = time.getHours();
  const minute = time.getMinutes();

  return `${hour}:${minute}`;
}

export function ISOStringToDate(date: string): Date {
  return new Date(date + "T00:00:00");
}

export function generateWeeksFrom(date: Date = TODAY): string[][] {
  const weeks: string[][] = [];

  const currentDate = new Date(date.valueOf());
  currentDate.setDate(1);
  currentDate.setDate(1 - currentDate.getDay());

  do {
    const week: string[] = [];

    for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
      week.push(dateToISOString(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    weeks.push(week);
  } while (currentDate.getMonth() === date.getMonth());

  return weeks;
}

export function setMonth(date: Date, add: boolean = true): Date {
  const sum = add ? +1 : -1;
  const newDate = new Date(date.valueOf());
  newDate.setMonth(newDate.getMonth() + sum);
  return new Date(newDate);
}
