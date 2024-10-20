import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearEvents, commit, deleteSavedEvents, getEvents, getSavedEvents, getUserInfo, init, record } from './index';

describe('index', () => {
    beforeEach(() => {
        clearEvents();

        globalThis.window = {
            addEventListener: vi.fn(),
            navigator: { language: 'en-US', platform: 'MacIntel', userAgent: 'Mozilla/5.0' },
            onbeforeunload: vi.fn(),
        } as any;

        globalThis.localStorage = {
            clear() {
                this.store = {};
            },
            getItem(key: string) {
                return this.store[key] || null;
            },
            key: () => null,
            length: 0,
            removeItem(key: string) {
                delete this.store[key];
            },
            setItem(key: string, value: string) {
                this.store[key] = value;
            },
            store: {} as Record<string, string>,
        };
    });

    it('should initialize and start a session', () => {
        const submitFn = vi.fn(); // mock submit function
        init(submitFn, { maxEventsLimitUntilSubmit: 100 });

        const events = getEvents();
        expect(events).toEqual([{ e: 'StartSession', t: expect.any(Number) }]);
    });

    it('should record an event with additional context', () => {
        record('ButtonClicked', 'HomePage', { extraData: '123' });
        expect(getEvents()).toEqual([{ c: 'HomePage', e: 'ButtonClicked', extraData: '123', t: expect.any(Number) }]);
    });

    it('should clear all events', () => {
        record('ButtonClicked');
        expect(getEvents()).toHaveLength(1);

        clearEvents();
        expect(getEvents()).toHaveLength(0);
    });

    it('should get saved events from localStorage', () => {
        record('Event1');
        commit(); // Saves events to localStorage

        const savedEvents = getSavedEvents();
        expect(savedEvents).toHaveLength(2); // Includes 'EndSession' from commit
        expect(savedEvents[0].e).toBe('Event1');
        expect(savedEvents[1].e).toBe('EndSession');
    });

    it('should commit events to localStorage and end session', () => {
        record('Event1');
        commit();

        const savedEvents = getSavedEvents();
        expect(savedEvents).toHaveLength(2); // 1 event + EndSession
        expect(savedEvents[1].e).toBe('EndSession');
    });

    it('should delete saved events from localStorage', () => {
        record('Event1');
        commit(); // Save events to localStorage

        deleteSavedEvents();
        expect(getSavedEvents()).toHaveLength(0); // Expect no events in localStorage
    });

    it('should retrieve user information', () => {
        const userInfo = getUserInfo();
        expect(userInfo).toHaveProperty('language');
        expect(userInfo).toHaveProperty('platform');
        expect(userInfo).toHaveProperty('userAgent');
    });

    it('should not submit events if limit is not reached', () => {
        const submitFn = vi.fn(); // mock submit function
        init(submitFn, { maxEventsLimitUntilSubmit: 100 });

        record('Event1');
        record('Event2');

        expect(submitFn).not.toHaveBeenCalled(); // Shouldn't submit yet
    });

    it('should submit events when max limit is reached', () => {
        const submitFn = vi.fn().mockResolvedValue({});
        vi.useFakeTimers();

        // Initialize the analytics with max limit of 2 events
        init(submitFn, { maxEventsLimitUntilSubmit: 2 });

        // Record two events
        record('Event1');
        record('Event2');

        // Commit events to localStorage
        commit();

        // Re-initialize the analytics (which checks the event limit and sets the timeout)
        init(submitFn, { maxEventsLimitUntilSubmit: 2 });

        // Fast-forward the time to trigger the submission
        vi.runAllTimers();

        // Verify that submitFn was called
        expect(submitFn).toHaveBeenCalledTimes(1);

        // Get the saved events from localStorage to verify correct submission
        const savedEvents = getSavedEvents();
        expect(submitFn).toHaveBeenCalledWith(expect.any(Object), savedEvents); // First argument is userInfo (mocked)

        // Clean up timers after test
        vi.useRealTimers();
    });
});
