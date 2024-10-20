export type Event = {
    [key: string]: any; // additional context or data
    c?: string; // optional context
    e: string; // event name
    t: number; // timestamp (seconds)
};

export type SubmitAnalyticsCallback = (userInfo: Record<string, any>, events: Event[]) => Promise<void>;

export type InitOptions = {
    maxEventsLimitUntilSubmit?: number;
};
