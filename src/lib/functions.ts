import { browser } from '$app/environment';
import { invalidate, invalidateAll } from '$app/navigation';
import date from 'date-and-time';
import { Timezone } from './stores/timezone';

export const timezone = Timezone('UTC');

export function bearer(method: string, bearer: string, body: object) {
	const request: any = {
		headers: {
			Authorization: `Bearer ${bearer}`,
			'Content-Type': 'application/json'
		},
		method: method
	};

	if (method != 'GET') request.body = JSON.stringify(body);

	return request;
}

export function toggleMessage(message: string, type = 'error') {
	let alert = document.querySelector('#alert');

	if (alert != null) {
		alert.classList.add('animate-bounce');
		alert.classList.remove('hidden');
		alert.classList.remove('text-red-600');
		alert.classList.remove('text-primary');

		alert.textContent = message;

		if (type == 'error') {
			alert.classList.add('text-red-600');
		} else {
			alert.classList.add('text-primary');
		}

		setTimeout(() => {
			alert?.classList.remove('animate-bounce');
		}, 2000);

		setTimeout(() => {
			alert?.classList.add('hidden');
		}, 3000);
	}
}

export function togglePopup(response: any) {
	let popup: any = document.querySelector('#popup');
	let message: any = document.querySelector('#popup-message');

	if (alert === null) return;

	popup.classList.remove('hidden');
	message.classList.remove('text-red-600');

	message.textContent = response.message;

	if (response.status == 'error') {
		message.classList.add('text-red-600');
	}
}

export function clearPopup() {
	let popup: any = document.querySelector('#popup');
	popup.classList.add('hidden');

	return;
}

export function toggleButtonLoad(selector: string, timeout = 3000) {
	let button: any = document.querySelector(selector);

	if (button != null) {
		button.classList.add('loading');
		button.disabled = true;

		setTimeout(() => {
			button.classList.remove('loading');
			button.disabled = false;
		}, timeout);
	}
}

// get the user timezone
function getUserTimezone(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export const format = (dt: any, d = 'datetime') => {
	dt = changeTimeZone(dt);

	if (d == 'date') {
		return date.format(dt, 'ddd, MMM DD YYYY');
	}

	return date.format(dt, 'ddd, MMM DD YYYY h:mm:ss A');
};

export function friendlyDate(dt: any, d = 'datetime') {
	let getTimezone = timezone.get();
	if (browser) {
		getTimezone = getUserTimezone();
	}
	const dateString = format(dt, d);
	const date = new Date(dateString);
	const now = new Date();
	//console.log(getTimezone)

	// Convert dates to the user's timezone
	const userDate = new Date(date.toLocaleString('en-US', { timeZone: getTimezone }));
	const userNow = new Date(now.toLocaleString('en-US', { timeZone: getTimezone }));

	const diffInSeconds = Math.floor((userNow.getTime() - userDate.getTime()) / 1000);

	const isSameDay =
		userDate.getDate() === userNow.getDate() &&
		userDate.getMonth() === userNow.getMonth() &&
		userDate.getFullYear() === userNow.getFullYear();

	if (diffInSeconds < 900) {
		return 'Just now';
	} else if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	} else if (isSameDay) {
		return `Today, ${userDate.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			timeZone: getTimezone
		})}`;
	} else if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours} hour${hours > 1 ? 's' : ''} ago`;
	} else if (diffInSeconds < 2592000) {
		const days = Math.floor(diffInSeconds / 86400);
		return `${days} day${days > 1 ? 's' : ''} ago`;
	} else if (diffInSeconds < 31536000) {
		const months = Math.floor(diffInSeconds / 2592000);
		return `${months} month${months > 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(diffInSeconds / 31536000);
		return `${years} year${years > 1 ? 's' : ''} ago`;
	}
}

// ✅ Or get a Date object with the specified Time zone
function changeTimeZone(date: any) {
	let timeZone = timezone.get();
	if (browser) {
		timeZone = getUserTimezone();
	}
	if (typeof date === 'string') {
		return new Date(
			new Date(date).toLocaleString('en-US', {
				timeZone
			})
		);
	}

	return new Date(
		date.toLocaleString('en-US', {
			timeZone
		})
	);
}

export function setCookie(key: string, value: string, days: number) {
	var expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
	if (browser) {
		document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
	}
}

export function getCookie(key: string) {
	if (browser) {
		var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
		return keyValue ? keyValue[2] : null;
	}

	return null;
}

function eraseCookie(key: string) {
	var keyValue = getCookie(key) || '';
	setCookie(key, keyValue, -1);
}

export function changeParam(param: string, value: number | string) {
	const url = new URL(window.location.toString());
	url.searchParams.set(param, `${value}`);
	history.replaceState(history.state, '', url);
	invalidateAll();
}

export function changePath(path: string) {
	const url = new URL(window.location.toString());
	url.pathname = path;
	history.replaceState(history.state, '', url);
	invalidateAll();
}

export function sortRates(rates: any) {
	// sort rates in decending order by price_buy;
	rates.sort((a: any, b: any) => a.price_buy - b.price_buy);
	// filter out rate with price_buy as 0
	const filtered_non_zero_rates = rates.filter((rate: any) => rate.price_buy > 0);
	const filtered_zero_rates = rates.filter((rate: any) => rate.price_buy <= 0);
	// soirt rates in descending order by price_buy
	filtered_zero_rates.sort((a: any, b: any) => b.price_sell - a.price_sell);
	// merge both rates
	rates = filtered_non_zero_rates.concat(filtered_zero_rates);

	return rates;
}

export async function fireInvalidateAll() {
	if (browser) {
		await invalidate;
	}
}

export function scrollToSection(
	id: string,
	options = {
		duration: 500,
		offset: 0, // Offset from the top in pixels
		behavior: 'smooth' as ScrollBehavior
	}
) {
	const element = document.getElementById(id);

	if (element) {
		const elementPosition = element.getBoundingClientRect().top;
		const offsetPosition = elementPosition + window.pageYOffset - options.offset;

		// Add a CSS class for animation
		element.classList.add('highlight-section');

		window.scrollTo({
			top: offsetPosition,
			behavior: options.behavior
		});

		// Remove the animation class after it completes
		setTimeout(() => {
			element.classList.remove('highlight-section');
		}, options.duration);
	}
}

export function parseJSONSafe(data: any): object | null {
	if (typeof data === 'object' && data !== null) {
		return data;
	}
	if (typeof data === 'string') {
		try {
			return JSON.parse(data);
		} catch (error) {
			console.error('Invalid JSON string:', data);
			return null;
		}
	}
	console.error('Data is neither a valid JSON string nor an object:', data);
	return null;
}

export function formatISODateTime(isoDate: string, includeTime = false, includeTimezone = false) {
	const dateObj = new Date(isoDate);
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short'
	};
	if (!includeTime) {
		delete options.hour;
		delete options.minute;
		delete options.second;
	}
	if (!includeTimezone) {
		delete options.timeZoneName;
	}
	const formattedDate = dateObj.toLocaleDateString('en-US', options);
	return formattedDate;
}

export function formatNumber(
	value: number,
	locales: string = 'en-US',
	options: Intl.NumberFormatOptions = {}
): string {
	const formatter = new Intl.NumberFormat(locales, options);
	return formatter.format(value);
}

export function login_uri(callbackPath: string | null = null) {
	if (browser) {
		let login_url = 'https://account.monierate.com/login';
		let current_origin = window.location.origin;
		let callback_url = callbackPath ? `${current_origin}${callbackPath}` : window.location.href;

		if (window.location.hostname === 'localhost') {
			login_url = 'http://localhost:5174/login';
		}

		return `${login_url}?callback_url=${encodeURIComponent(callback_url)}`;
	}
	return null;
}

export function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getReadableFrequency(frequency: {
	type: string;
	value: number;
	time?: number;
}): string {
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	function formatTime(hour?: number): string {
		if (hour === undefined) return '';
		const period = hour >= 12 ? 'PM' : 'AM';
		const formattedHour = hour % 12 || 12;
		return ` at ${formattedHour}:00 ${period}`;
	}

	let timeSuffix = formatTime(frequency.time);

	switch (frequency.type) {
		case 'interval':
			return `Every ${frequency.value} ${frequency.value === 1 ? 'minute' : 'minutes'}`;

		case 'hourly':
			return `Every ${frequency.value} ${frequency.value === 1 ? 'hour' : 'hours'}`;

		case 'daily':
			return `Every ${frequency.value} ${frequency.value === 1 ? 'day' : 'days'}`;

		case 'weekly':
			return `Every ${daysOfWeek[frequency.value - 1]}${timeSuffix}`;

		case 'monthly':
			const daySuffix = getDaySuffix(frequency.value);
			return `Every ${frequency.value}${daySuffix} of the month${timeSuffix}`;

		default:
			return 'Unknown frequency';
	}
}

export function getNextTriggerTime(
	frequency: { type: string; value: number; time?: number },
	timezone: string = 'UTC'
): string {
	const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
	const nextTrigger = new Date(now);
	nextTrigger.setSeconds(0, 0); // Reset milliseconds

	switch (frequency.type) {
		case 'interval':
			nextTrigger.setMinutes(now.getMinutes() + frequency.value);
			break;

		case 'hourly':
			nextTrigger.setHours(now.getHours() + frequency.value);
			break;

		case 'daily':
			nextTrigger.setDate(now.getDate());
			nextTrigger.setHours(frequency.value, 0, 0, 0);
			break;

		case 'weekly':
			const selectedWeekday = frequency.value - 1; // Day of the week (e.g., Tuesday = 2)
			const selectedHour = frequency.time ?? 0; // Selected hour (24-hour format)
			const currentWeekday = now.getDay();
			const currentHour = now.getHours();

			if (currentWeekday === selectedWeekday) {
				if (currentHour < selectedHour) {
					nextTrigger.setHours(selectedHour, 0, 0, 0);
				} else {
					nextTrigger.setDate(now.getDate() + 7);
					nextTrigger.setHours(selectedHour, 0, 0, 0);
				}
			} else {
				let daysToAdd = (selectedWeekday - currentWeekday + 7) % 7;
				nextTrigger.setDate(now.getDate() + (daysToAdd === 0 ? 7 : daysToAdd));
				nextTrigger.setHours(selectedHour, 0, 0, 0);
			}
			break;

		case 'monthly':
			nextTrigger.setMonth(now.getDate() <= frequency.value ? now.getMonth() : now.getMonth() + 1);
			const maxDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
			nextTrigger.setDate(
				now.getDate() <= frequency.value ? frequency.value : Math.min(frequency.value, maxDays)
			);
			nextTrigger.setHours(frequency.time ?? 0, 0, 0, 0);
			break;

		default:
			throw new Error('Unknown frequency type');
	}

	return formatFriendlyDate(nextTrigger, timezone, 'en-US', frequency.type.toLowerCase());
}

function formatFriendlyDate(
	date: Date,
	timezone: string = 'UTC',
	locale: string = 'en-US',
	interval: string = ''
): string {
	const now = new Date(new Date().toLocaleString(locale, { timeZone: timezone }));
	const diffSeconds = (date.getTime() - now.getTime()) / 1000;
	const diffDays = Math.floor(diffSeconds / 86400);

	const timeString = date.toLocaleTimeString(locale, {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});

	if (interval === 'daily') {
		if (
			diffDays === 0 &&
			now.getDate() === date.getDate() &&
			now.getMonth() === date.getMonth() &&
			now.getFullYear() === date.getFullYear()
		) {
			return `Today ${timeString}`;
		}

		if (diffDays <= 1 && now.getFullYear() === date.getFullYear()) {
			return `Tomorrow ${timeString}`;
		}
	}

	let options: Intl.DateTimeFormatOptions = {
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
	};

	if (interval === 'weekly') {
		options = {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
		};
	}

	return date.toLocaleDateString(locale, options);
}

export function getDaySuffix(day: number): string {
	if (day >= 11 && day <= 13) return 'th';
	switch (day % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}

export function capitalizeAndJoin(words: string[]): string {
	return words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(', ');
}

export function setUrlParam(key: string, value: string | number) {
	if (browser) {
		const url = new URL(window.location.href);
		url.searchParams.set(key, String(value));
		window.history.pushState({}, '', url);
	}
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    console.warn("Clipboard API not available");
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text:", err);
    return false;
  }
}
