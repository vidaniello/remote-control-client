export enum LogType {
    TRACE = "TRACE",
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    FATAL = "FATAL"
}

export interface LogMessage {
    type: LogType,
    message: string
}