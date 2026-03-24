export type Alert = {
	_id: string;
	quote: string;
	base: string;
	type: string;
	price: number;
	direction: string;
	frequency: {
		type: string;
		value: number;
		time?: number;
	};
	exchange: string[];
	cooldown: number;
	channel: string[];
	note?: string;
	disable_after_trigger: boolean;
	status: string;
	created_at: any;
	last_triggered: any;
};
