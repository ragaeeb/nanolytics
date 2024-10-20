import type { Event, InitOptions, SubmitAnalyticsCallback } from './types';

import { commit, deleteSavedEvents, getUserInfo, record } from './api';

/**
 * Initializes the analytics tracking system.
 * Sets up event listeners for session tracking and visibility changes, and
 * checks if saved events exceed the submission threshold. If the threshold is exceeded,
 * it triggers the provided submission function.
 *
 * @param {SubmitAnalyticsCallback} submitFn - A function to handle the submission of analytics data.
 * @param {InitOptions} options - Configuration options for the initialization.
 * @param {number} [options.maxEventsLimitUntilSubmit=100] - Maximum number of events before triggering a submission.
 *
 * @example
 * init(submitAnalytics, { maxEventsLimitUntilSubmit: 150 });
 */
export const init = (submitFn: SubmitAnalyticsCallback, options: InitOptions) => {
    window.onbeforeunload = commit; // Save events when the window is about to close
    window.addEventListener('visibilitychange', () => record(document.hidden ? 'Hidden' : 'Visible')); // Track visibility changes

    record('StartSession');

    const savedEvents: Event[] = JSON.parse(localStorage.getItem('events') || '[]');

    if (savedEvents.length > (options.maxEventsLimitUntilSubmit || 100)) {
        setTimeout(() => {
            submitFn(getUserInfo(), savedEvents).then(deleteSavedEvents);
        }, 3000); // Delay submission for a smoother experience
    }
};

export * from './api';
export * from './types';
