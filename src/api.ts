import type { Event } from './types';

const events: Event[] = [];

/**
 * Creates a new event object with the provided event name and current timestamp.
 *
 * @param {string} e - The event name to record.
 * @returns {Event} - An event object with a name and timestamp.
 */
const createEvent = (e: string): Event => ({
    e,
    t: Math.floor(Date.now() / 1000),
});

/**
 * Clears all events in the current session.
 *
 * @example
 * clearEvents();
 */
export const clearEvents = () => {
    events.length = 0;
};

/**
 * Retrieves saved events from localStorage.
 *
 * @returns {Event[]} - An array of saved events.
 *
 * @example
 * const saved = getSavedEvents();
 */
export const getSavedEvents = (): Event[] => JSON.parse(localStorage.getItem('events') || '[]');

/**
 * Records a new event with optional context and additional data.
 *
 * @param {string} event - The event name to record.
 * @param {string} [context] - Optional context (e.g., screen or component name).
 * @param {Record<string, any>} [moreContext={}] - Additional data to record with the event.
 *
 * @example
 * record('ButtonClicked', 'HomePage', { userId: '123' });
 */
export const record = (event: string, context?: string, moreContext: Record<string, any> = {}) => {
    const stat: Event = { ...createEvent(event), ...moreContext };

    if (context) {
        stat.c = context;
    }

    events.push(stat);
};

/**
 * Commits the current session events to localStorage and ends the session by recording an 'EndSession' event.
 *
 * @example
 * commit();
 */
export const commit = () => {
    record('EndSession');
    localStorage.setItem('events', JSON.stringify([...getSavedEvents(), ...events]));
};

/**
 * Deletes all saved events from localStorage.
 *
 * @example
 * deleteSavedEvents();
 */
export const deleteSavedEvents = () => localStorage.removeItem('events');

/**
 * Retrieves the current session's events.
 *
 * @returns {Event[]} - A copy of the current session's events.
 *
 * @example
 * const events = getEvents();
 */
export const getEvents = (): Event[] => events.slice();

/**
 * Retrieves user information from the browser (e.g., language, platform, user agent).
 *
 * @returns {Object} - An object containing the user's language, platform, and user agent.
 *
 * @example
 * const userInfo = getUserInfo();
 */
export const getUserInfo = () => ({
    language: window.navigator.language,
    platform: window.navigator.platform,
    userAgent: window.navigator.userAgent,
});
