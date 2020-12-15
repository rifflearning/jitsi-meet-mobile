import moment from "moment";
import "moment-recur";

export const daysOfWeekMap = {
    'Mon': 1,
    'Tue': 2,
    'Wed': 3,
    'Thu': 4,
    'Fri': 5,
    'Sat': 6,
    'Sun': 7,
};

export const getRecurringDailyEventsByOccurance = ({
    startDate,
    daysOccurances,
    daysInterval,
}) =>
    [startDate].concat(
        moment(startDate)
            .recur()
            .every(daysInterval, "days")
            .next(daysOccurances - 1)
    );

export const getRecurringDailyEventsByEndDate = ({
    startDate,
    endDate,
    daysInterval,
    daysOccurances,
}) =>
    endDate
        ? moment(startDate).recur(endDate).every(daysInterval, "days").all()
        : getRecurringDailyEventsByOccurance({
              startDate,
              daysOccurances,
              daysInterval,
          });

export const getRecurringWeeklyEventsByOccurance = ({
    startDate,
    weeksOccurances,
    daysOfWeek,
}) => {
    const isStartDateBelongsToDaysArr = daysOfWeek.find(
        (day) => day === daysOfWeekMap[moment(startDate).format("ddd")]
    );
    return isStartDateBelongsToDaysArr
        ? [startDate].concat(
              moment(startDate)
                  .recur()
                  .every(daysOfWeek)
                  .daysOfWeek()
                  .next(weeksOccurances - 1)
          )
        : moment(startDate)
              .recur()
              .every(daysOfWeek)
              .daysOfWeek()
              .next(weeksOccurances);
};

export const getRecurringWeeklyEventsByEndDate = ({
    startDate,
    endDate,
    weeksOccurances,
    daysOfWeek,
}) =>
    endDate
        ? moment(startDate).recur(endDate).every(daysOfWeek).daysOfWeek().all()
        : getRecurringWeeklyEventsByOccurance({
              startDate,
              weeksOccurances,
              daysOfWeek,
          });

export const getRecurringMonthlyEventsByOccurance = ({
    startDate,
    monthOccurances,
    monthlyBy,
    dayOfMonth,
    monthlyByWeekDay,
    monthlyByPosition,
}) => {
    if (monthlyBy === "monthlyByDay") {
        const isStartDayEqualToDayOfMonth =
            parseInt(moment(startDate).format("D")) === dayOfMonth;

        return isStartDayEqualToDayOfMonth
            ? [startDate].concat(
                  moment(startDate)
                      .recur()
                      .every(dayOfMonth)
                      .daysOfMonth()
                      .next(monthOccurances - 1)
              )
            : moment(startDate)
                  .recur()
                  .every(dayOfMonth)
                  .daysOfMonth()
                  .next(monthOccurances);
    } else {
        const recurrence = moment(startDate)
            .recur()
            .every(monthlyByWeekDay)
            .daysOfWeek()
            .every(monthlyByPosition)
            .weeksOfMonthByDay()
            .next(monthOccurances);
        const startDateFromRecurrence = moment(startDate)
            .recur(recurrence[0])
            .every(monthlyByWeekDay)
            .daysOfWeek()
            .every(monthlyByPosition)
            .weeksOfMonthByDay()
            .all()[0];

        const isStartDayEqualToStartDateFromRecurrence = moment(
            startDate
        ).isSame(startDateFromRecurrence, "day");
        return isStartDayEqualToStartDateFromRecurrence
            ? [startDate].concat(
                  moment(startDate)
                      .recur()
                      .every(monthlyByWeekDay)
                      .daysOfWeek()
                      .every(monthlyByPosition)
                      .weeksOfMonthByDay()
                      .next(monthOccurances - 1)
              )
            : recurrence;
    }
};

export const getRecurringMonthlyEventsByEndDate = ({
    startDate,
    endDate,
    monthOccurances,
    monthlyBy,
    dayOfMonth,
    monthlyByWeekDay,
    monthlyByPosition,
}) => {
    if (monthlyBy === "monthlyByDay") {
        return endDate
            ? moment(startDate)
                  .recur(endDate)
                  .every(dayOfMonth)
                  .daysOfMonth()
                  .all()
            : getRecurringMonthlyEventsByOccurance({
                  startDate,
                  monthOccurances,
                  monthlyBy: "monthlyByDay",
                  dayOfMonth,
                  monthlyByWeekDay,
                  monthlyByPosition,
              });
    } else {
        return endDate
            ? moment(startDate)
                  .recur(endDate)
                  .every(monthlyByWeekDay)
                  .daysOfWeek()
                  .every(monthlyByPosition)
                  .weeksOfMonthByDay()
                  .all()
            : getRecurringMonthlyEventsByOccurance({
                  startDate,
                  monthOccurances,
                  monthlyBy: "monthlyByWeekDay",
                  dayOfMonth,
                  monthlyByWeekDay,
                  monthlyByPosition,
              });
    }
};
