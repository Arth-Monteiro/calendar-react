const TODAY = new Date();
export const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function generateWeeksFrom(date: Date = TODAY): string[][] {
  const weeks: string[][] = [];

  const currentDate = new Date(date.valueOf());
  currentDate.setDate(1);
  currentDate.setDate(1 - currentDate.getDay());

  do {
    const week: string[] = [];

    for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
      let isoDate = "";
      isoDate += currentDate.getFullYear() + "-";
      isoDate += (currentDate.getMonth() + 1).toString().padStart(2, "0") + "-";
      isoDate += currentDate.getDate().toString().padStart(2, "0");

      week.push(isoDate);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    weeks.push(week);
  } while (currentDate.getMonth() === date.getMonth());

  return weeks;
}
