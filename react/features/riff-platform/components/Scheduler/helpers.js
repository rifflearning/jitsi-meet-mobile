import moment from 'moment';
import 'moment-recur';
import momentTZ from 'moment-timezone';

export const daysOfWeekMap = {
    'Mon': 1,
    'Tue': 2,
    'Wed': 3,
    'Thu': 4,
    'Fri': 5,
    'Sat': 6,
    'Sun': 7
};

export const getRecurringDailyEventsByOccurance = ({
    startDate,
    daysOccurances,
    daysInterval
}) => [ startDate ].concat(
        startDate
            .recur()
            .every(daysInterval, 'days')
            .next(daysOccurances - 1)
);

// eslint-disable-next-line no-confusing-arrow
export const getRecurringDailyEventsByEndDate = ({
    startDate,
    endDate,
    daysInterval,
    daysOccurances
}) =>
    endDate
        ? startDate
            .recur(endDate)
            .every(daysInterval, 'days')
            .all()
        : getRecurringDailyEventsByOccurance({
            startDate,
            daysOccurances,
            daysInterval
        });

export const getRecurringWeeklyEventsByOccurance = ({
    startDate,
    weeksOccurances,
    daysOfWeek
}) => {
    const isStartDateBelongsToDaysArr = daysOfWeek.find(
        day => day === daysOfWeekMap[startDate.format('ddd')]
    );

    return isStartDateBelongsToDaysArr
        ? [ startDate ].concat(
                startDate
                  .recur()
                  .every(daysOfWeek)
                  .daysOfWeek()
                  .next(weeksOccurances - 1)
        )
        : startDate
              .recur()
              .every(daysOfWeek)
              .daysOfWeek()
              .next(weeksOccurances);
};

// eslint-disable-next-line no-confusing-arrow
export const getRecurringWeeklyEventsByEndDate = ({
    startDate,
    endDate,
    weeksOccurances,
    daysOfWeek
}) => endDate
    ? startDate
            .recur(endDate)
            .every(daysOfWeek)
            .daysOfWeek()
            .all()
    : getRecurringWeeklyEventsByOccurance({
        startDate,
        weeksOccurances,
        daysOfWeek
    });
export const getRecurringMonthlyEventsByOccurance = ({
    startDate,
    monthOccurances,
    monthlyBy,
    dayOfMonth,
    monthlyByWeekDay,
    monthlyByPosition
}) => {
    if (monthlyBy === 'monthlyByDay') {
        const isStartDayEqualToDayOfMonth
            = parseInt(startDate.format('D'), 10) === dayOfMonth;

        return isStartDayEqualToDayOfMonth
            ? [ startDate ].concat(
                startDate
                      .recur()
                      .every(dayOfMonth)
                      .daysOfMonth()
                      .next(monthOccurances - 1)
            )
            : startDate
                  .recur()
                  .every(dayOfMonth)
                  .daysOfMonth()
                  .next(monthOccurances);
    }

    const recurrence = startDate
            .recur()
            .every(monthlyByWeekDay)
            .daysOfWeek()
            .every(monthlyByPosition)
            .weeksOfMonthByDay()
            .next(monthOccurances);
    const startDateFromRecurrence = startDate
            .recur(recurrence[0])
            .every(monthlyByWeekDay)
            .daysOfWeek()
            .every(monthlyByPosition)
            .weeksOfMonthByDay()
            .all()[0];

    const isStartDayEqualToStartDateFromRecurrence
            = startDate.isSame(startDateFromRecurrence, 'day');

    return isStartDayEqualToStartDateFromRecurrence
        ? [ startDate ].concat(
                startDate
                      .recur()
                      .every(monthlyByWeekDay)
                      .daysOfWeek()
                      .every(monthlyByPosition)
                      .weeksOfMonthByDay()
                      .next(monthOccurances - 1)
        )
        : recurrence;

};

export const getRecurringMonthlyEventsByEndDate = ({
    startDate,
    endDate,
    monthOccurances,
    monthlyBy,
    dayOfMonth,
    monthlyByWeekDay,
    monthlyByPosition
}) => {
    if (monthlyBy === 'monthlyByDay') {
        return endDate
            ? startDate
                  .recur(endDate)
                  .every(dayOfMonth)
                  .daysOfMonth()
                  .all()
            : getRecurringMonthlyEventsByOccurance({
                startDate,
                monthOccurances,
                monthlyBy: 'monthlyByDay',
                dayOfMonth,
                monthlyByWeekDay,
                monthlyByPosition
            });
    }

    return endDate
        ? startDate
                  .recur(endDate)
                  .every(monthlyByWeekDay)
                  .daysOfWeek()
                  .every(monthlyByPosition)
                  .weeksOfMonthByDay()
                  .all()
        : getRecurringMonthlyEventsByOccurance({
            startDate,
            monthOccurances,
            monthlyBy: 'monthlyByWeekDay',
            dayOfMonth,
            monthlyByWeekDay,
            monthlyByPosition
        });

};

// Removes timezone DST offset from date for recurring meetings.
export const removeDstOffsetTimezoneTime = (date, timezone) => {
    const isDST = momentTZ.tz(date, timezone).isDST();

    if (!isDST) {
        return date;
    }
    const timezoneOffset = getOffsetDelta(timezone);

    return moment(date)
        .clone()
        .subtract(timezoneOffset, 'minutes');
};

// Adds timezone DST offset from date for recurring meetings.
export const addDstOffsetTimezoneTime = (date, timezone) => {
    const isDST = momentTZ.tz(date, timezone).isDST();

    if (isDST) {
        return date;
    }
    const timezoneOffset = getOffsetDelta(timezone);

    return moment(date)
        .clone()
        .add(timezoneOffset, 'minutes');
};

/**
 * Return the current timezone difference in UTC offsets
 * between Jan 1 and Jun 1 of the current year.
 * No DST transitions will occur anywhere in the world on these two dates.
 *
 * @param {string} tz - Timezone.
 * @returns {number} - Returns delta in minutes.
 */
function getOffsetDelta(tz) {
    const janOffset = moment.tz({ month: 0,
        day: 1 }, tz).utcOffset();
    const junOffset = moment.tz({ month: 5,
        day: 1 }, tz).utcOffset();

    return Math.abs(junOffset - janOffset);
}

// Returns time by selected time and timezone
export const getDateByTimeAndTimezone = (date, timeZone) => {
    const t = moment(date)
        .clone()
        .format()
        .slice(0, 19);

    return momentTZ.tz(t, timeZone);
};
