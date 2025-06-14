const getAlignedX = (align, x, width, textWidth) => {
	switch (align) {
		case 'center':
			return x + (width - textWidth) / 2;
		case 'right':
			return x + width - textWidth;
		case 'left':
		default:
			return x;
	}
};

const drawJustifiedText = (ctx, line, x, y, width) => {
	// get text line words
	const words = line.split(' ');

	// draw line if cntain only one word
	if (words.length === 1) return ctx.fillText(line, x, y);

	// get text line width
	let lineWidth = ctx.measureText(line).width;

	// get count of spaces
	let totalSpaces = words.length - 1;

	// get space width
	let spaceWidth = totalSpaces > 0 ? (width - lineWidth + totalSpaces * ctx.measureText(' ').width) / totalSpaces : 0;

	// set default vars
	let currentX = x;

	for (let i = 0; i < words.length; i++) {
		// draw word
		ctx.fillText(words[i], currentX, y);

		// update current x
		if (i < words.length - 1) currentX += ctx.measureText(words[i]).width + spaceWidth;
	}
};

export default (ctx, text, x, y, options = {}) => {
	const { align = 'left', justify = false, lineHeight = 20, width = 200 } = options;

	// set to 'left' to handle alignment manually
	ctx.textAlign = 'left';

	// set default vars
	const words = text
		.split(' ')
		.map((word) => (word.includes('\n') ? word.split(/(\r?\n)/) : word))
		.flat();
	let currentY = y + lineHeight;
	let lines = [];
	let line = '';

	for (let i = 0; i < words.length; i++) {
		if (words[i] == '\n') {
			// save current line
			lines.push(line.trim());

			// reset current line
			line = '';

			continue;
		}

		// set test line
		let testLine = line + words[i] + ' ';

		// get test line width
		let testLineWidth = ctx.measureText(testLine).width;

		if (testLineWidth > width && line !== '') {
			// save current line
			lines.push(line.trim());

			// set new current line
			line = words[i] + ' ';
		} else {
			// update current line
			line = testLine;
		}
	}

	// add last line to array
	lines.push(line.trim());

	for (let i = 0; i < lines.length; i++) {
		if (justify && (lines.length == 1 || (i < lines.length - 1 && lines[i + 1] != ''))) {
			// draw justified text
			drawJustifiedText(ctx, lines[i], x, currentY, width);
		} else {
			// draw text
			ctx.fillText(lines[i], getAlignedX(align, x, width, ctx.measureText(lines[i]).width), currentY);
		}

		// update current y
		currentY += lineHeight;
	}
};
