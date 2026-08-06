// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
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
