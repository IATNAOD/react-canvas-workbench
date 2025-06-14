const getHueSectorFraction = (hue, sector) => {
	return (sector + hue / 60) % 6;
};

const computeRgbComponent = (value, saturation, fraction) => {
	const factor = Math.max(Math.min(fraction, 4 - fraction, 1), 0);
	return value - value * saturation * factor;
};

export const toHex = (n) => n.toString(16).padStart(2, '0');

export const hsvToRgb = (h, s, v) => {
	const saturation = s / 100;
	const value = v / 100;

	const r = Math.round(computeRgbComponent(value, saturation, getHueSectorFraction(h, 5)) * 255);

	const g = Math.round(computeRgbComponent(value, saturation, getHueSectorFraction(h, 3)) * 255);

	const b = Math.round(computeRgbComponent(value, saturation, getHueSectorFraction(h, 1)) * 255);

	return [r, g, b];
};

export const rgbToHsv = (r, g, b) => {
	const red = r / 255;
	const green = g / 255;
	const blue = b / 255;

	const max = Math.max(red, green, blue);
	const min = Math.min(red, green, blue);
	const delta = max - min;

	const value = max;
	const saturation = max === 0 ? 0 : delta / max;

	let hue;
	if (delta === 0) {
		hue = 0;
	} else if (max === red) {
		hue = ((green - blue) / delta + (green < blue ? 6 : 0)) * 60;
	} else if (max === green) {
		hue = ((blue - red) / delta + 2) * 60;
	} else {
		hue = ((red - green) / delta + 4) * 60;
	}

	return [hue, saturation * 100, value * 100];
};

const getLuminance = (r, g, b) => {
	r = r / 255.0;
	g = g / 255.0;
	b = b / 255.0;

	if (r <= 0.03928) r = r / 12.92;
	else r = Math.pow((r + 0.055) / 1.055, 2.4);

	if (g <= 0.03928) g = g / 12.92;
	else g = Math.pow((g + 0.055) / 1.055, 2.4);

	if (b <= 0.03928) b = b / 12.92;
	else b = Math.pow((b + 0.055) / 1.055, 2.4);

	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const getContrastColor = (hexColor, dark = '#000000', light = '#FFFFFF') => {
	hexColor = hexColor.replace('#', '');

	const r = parseInt(hexColor.substring(0, 2), 16);
	const g = parseInt(hexColor.substring(2, 4), 16);
	const b = parseInt(hexColor.substring(4, 6), 16);

	const luminance = getLuminance(r, g, b);

	return luminance > 0.5 ? dark : light;
};
