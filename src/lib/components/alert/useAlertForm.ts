import { writable } from 'svelte/store';

export type Provider = { name: string; code: string; icon: string; pairs: any };
export type DropdownOption = { label: string; value: string; icon: string };

export enum CurrentScreen {
	FIRST_SCREEN = 's1',
	SECOND_SCREEN = 's2',
	THIRD_SCREEN = 's3'
}

export enum Channels {
	EMAIL = 'email',
	WEBHOOK = 'webhook'
}

export const current_screen = writable(CurrentScreen.FIRST_SCREEN);

export const change_screen = (screen: CurrentScreen) => {
	current_screen.set(screen);
};
