// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Error {
		message: string;
		// Short id stamped by handleError; printed on the error page so a user
		// report can be matched to a line in the Worker logs.
		id?: string;
	}
	interface Locals {
		access: {
			token: string;
		};
		ucountry: string;
	}
	// interface PageData {}
	interface PageState {
		// Shallow-routing state pushed by the pair-overview page's provider
		// insight & "view all" highlights overlays.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		insight?: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		highlights?: any;
	}
	// interface Platform {}
}
