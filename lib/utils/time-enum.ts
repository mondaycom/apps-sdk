const SECOND_IN_MILLISECONDS = 1000;

export enum TIME_IN_SECONDS {
  YEAR = 365 * 24 * 60 * 60,
  MONTH31Days = 31 * 24 * 60 * 60,
  MONTH30Days = 30 * 24 * 60 * 60,
  MONTH29Days = 29 * 24 * 60 * 60,
  MONTH28Days = 28 * 24 * 60 * 60,
  DAY = 24 * 60 * 60,
  HOUR = 60 * 60,
  MINUTE = 60
}

export enum TIME_IN_MILLISECOND {
  YEAR = TIME_IN_SECONDS.YEAR * SECOND_IN_MILLISECONDS,
  MONTH31Days = TIME_IN_SECONDS.MONTH31Days * SECOND_IN_MILLISECONDS,
  MONTH30Days = TIME_IN_SECONDS.MONTH30Days * SECOND_IN_MILLISECONDS,
  MONTH29Days = TIME_IN_SECONDS.MONTH29Days * SECOND_IN_MILLISECONDS,
  MONTH28Days = TIME_IN_SECONDS.MONTH28Days * SECOND_IN_MILLISECONDS,
  DAY = TIME_IN_SECONDS.DAY * SECOND_IN_MILLISECONDS,
  HOUR = TIME_IN_SECONDS.HOUR * SECOND_IN_MILLISECONDS,
  MINUTE = TIME_IN_SECONDS.MINUTE * SECOND_IN_MILLISECONDS,
  SECOND = SECOND_IN_MILLISECONDS
}
