export function getIconPath(icon: string | undefined): string {
	if (!icon) return '/icons/png/default.png';
	// Already a site-relative path (e.g. a currency icon under /icons/currencies) —
	// pass through unchanged instead of nesting it under /icons/png.
	if (icon.startsWith('/')) return icon;
	if (icon.endsWith('.svg')) return `/icons/svg/${icon}`;
	return `/icons/png/${icon}`;
}

export const getDeviceName = (request: any) => {
    const headers = request.headers;
    const userAgent = headers.get('user-agent') || '';
    console.log(userAgent);

    let detectedDevice = 'Unknown';

    if (userAgent.includes('iPhone')) {
        detectedDevice = 'iphone';
    } else if (userAgent.includes('Android')) {
        detectedDevice = 'Android';
    } else {
        detectedDevice = 'Unknown';
    }

    return detectedDevice;
};

export const mapProvidersByCode = (providers: any[], pairs: string[]): Record<string, any> => {
	const filteredProviders: Record<string, any> = {};

	for (const provider of providers) {
		if (provider.changer_tags?.includes('bank')) {
			continue;
		}

		if (provider.is_public === false) {
			continue;
		}

		filteredProviders[provider.code] = provider;

		try {
			if (provider.pairs) {
				Object.keys(provider.pairs).forEach((pair) => {
					if (!pairs.includes(pair)) {
						pairs.push(pair);
					}
				});
			}
		} catch (err) {
			console.error(err);
		}
	}

	return filteredProviders;
};
