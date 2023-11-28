import { useState, useEffect } from "react";
import * as React from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import "./styles";
function Index(props: Props) {
  const [toDate, setToDate] = useState<any>();

  useEffect(() => {
    const onUpdateOptions = props.getUpdateOptions();
    if (!onUpdateOptions) return;

    const selectedDates =
      onUpdateOptions?.dataViews[0]?.metadata?.objects?.selectedDates;

    const dates = selectedDates?.selectedDates as string;
    const startAndEndUnixTime = selectedDates?.startAndEndUnixTime as string;

    if (!selectedDates) return;

    const [startDate, endDate] = dates.split("_");
    const [startUnixTime, endDateUnix] = startAndEndUnixTime.split("_");

    const fromDateInHijri = getDateInHijri(startDate);
    const toDateInHijri = getDateInHijri(endDate);
    const dateIds = generateHijriDateRange(fromDateInHijri, toDateInHijri);
    const fromDateObj = new Date(parseInt(startUnixTime) * 1000);
    const toDateObj = new Date(parseInt(endDateUnix) * 1000);
    // setToDate([
    //   new DateObject().set({ day: 14, month: 11, year: 2023 }),
    //   new DateObject().set({ day: 30, month: 11, year: 2023 }),
    // ]);
    setToDate(getDateObjectFromDate(fromDateObj));
    setTimeout(() => {
      setToDate([
        getDateObjectFromDate(fromDateObj),
        getDateObjectFromDate(toDateObj),
      ]);

      props.onDatesChange(dateIds, startUnixTime + "_" + endDateUnix);
    }, 0);
  }, []);

  const getDateObjectFromDate = (date: Date) => {
    const obj = new DateObject().set({
      day: date.getDate(),
      year: date.getFullYear(),
    });
    obj.set({ month: obj.months[date.getMonth()].number });
    return obj;
  };

  const getDateInHijri = (input: string) => {
    const day = parseInt(input.slice(-2), 10);
    const month = parseInt(input.slice(-4, -2), 10);
    const year = parseInt(input.slice(0, -4), 10);

    return { year, month, day } as HijriDate;
  };

  const addZeroToDate = (date: string) => {
    if (date.length < 2) {
      return `0${date}`;
    }
    return date;
  };

  const getDateId = (hijriDate: HijriDate) => {
    const { year, month, day } = hijriDate;
    return parseInt(
      addZeroToDate(year.toString()) +
        addZeroToDate(month.toString()) +
        addZeroToDate(day.toString())
    );
  };

  const generateHijriDateRange = (startDate: HijriDate, endDate: HijriDate) => {
    const dateRange: number[] = [];
    if (
      startDate.year === endDate.year &&
      startDate.month === endDate.month &&
      startDate.day === endDate.day
    ) {
      return [getDateId(startDate), getDateId(startDate)];
    }

    let currentYear = startDate.year;
    let currentMonth = startDate.month;
    let currentDay = startDate.day;

    while (
      currentYear < endDate.year ||
      (currentYear === endDate.year && currentMonth < endDate.month) ||
      (currentYear === endDate.year &&
        currentMonth === endDate.month &&
        currentDay <= endDate.day)
    ) {
      const date: HijriDate = {
        year: currentYear,
        month: currentMonth,
        day: currentDay,
      };

      dateRange.push(getDateId(date));

      currentDay++;
      if (currentDay > 31) {
        currentDay = 1;
        currentMonth++;

        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }
      }
    }

    return dateRange;
  };

  const handleTomDateChange = (dateRage: any[]) => {
    let dateIds: number[] = [];
    const fromDate = dateRage[0];
    const { day: fromDateDay }: { day: number } = fromDate;
    const { year: fromDateYear }: { year: number } = fromDate;
    const fromDateMonth = fromDate.month.number as number;
    const startDateInHijry: HijriDate = {
      day: fromDateDay,
      year: fromDateYear,
      month: fromDateMonth,
    };

    const toDate = dateRage[1];
    if (toDate) {
      const { day: toDateDay }: { day: number } = toDate;
      const { year: toDateYear }: { year: number } = toDate;
      const toDateMonth = toDate.month.number;
      const endDateInHijry: HijriDate = {
        day: toDateDay,
        year: toDateYear,
        month: toDateMonth,
      };
      dateIds = generateHijriDateRange(startDateInHijry, endDateInHijry);
    } else {
      dateIds = generateHijriDateRange(startDateInHijry, startDateInHijry);
    }
    let fromUnixTime = dateRage[0].unix as number;
    let toUnixTime = dateRage[1] ? (dateRage[1].unix as number) : fromUnixTime;

    props.onDatesChange(dateIds, fromUnixTime + "_" + toUnixTime);
  };

  return (
    <div className="wrapper">
      <div className="to calendar">
        <Calendar
          range
          onChange={handleTomDateChange}
          value={toDate}
          calendar={persian}
          locale={persian_fa}
          highlightToday={false}
        />
      </div>
    </div>
  );
}

export default Index;
interface Props {
  onDatesChange(dateIds: number[], startAndEndUnixTime: string): void;
  getUpdateOptions(): VisualUpdateOptions;
}
interface HijriDate {
  year: number;
  month: number;
  day: number;
}
