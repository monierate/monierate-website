import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

export const BANNER_COOKIE_PREFIX = 'banner_idx_';

export const createBannerStore = () => {
    const { subscribe, update } = writable(new Map<string, number>());

    return {
        subscribe,

        initIndex: (bannerName: string, index: number) => {
            update(state => {
                state.set(bannerName, index);
                return state;
            });
        },

        getIndex: (bannerName: string): number => {
            const state = get({ subscribe });
            return state.get(bannerName) || 0;
        },

        getNextIndex: (bannerName: string, total: number, isFirstVisit = false): number => {
            let newIndex = 0;

            update(state => {
                const currentIndex = state.get(bannerName) || 0;

                // First visit - random index
                if (isFirstVisit && total > 1) {
                    newIndex = Math.floor(Math.random() * total);
                }
                // Subsequent visits - next in sequence
                else if (total > 1) {
                    newIndex = (currentIndex + 1) % total;
                }

                state.set(bannerName, newIndex);

                if (browser) {
                    const cookieName = `${BANNER_COOKIE_PREFIX}${bannerName}`;
                    document.cookie = `${cookieName}=${newIndex}; path=/; max-age=2592000`; // 30 days
                }

                return state;
            });

            return newIndex;
        }
    };
};

export const bannerStore = createBannerStore();
