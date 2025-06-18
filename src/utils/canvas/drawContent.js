import drawText from './drawText';

export default ({ canvas, ctx, width, height, elements, customization, customizationSettings }) => {
	const scale = width / 1600;

	canvas.width = width / scale;

	canvas.height = height / scale;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let element of elements) {
		if (!element.visible) continue;

		let x = element.x / scale;
		let y = element.y / scale;

		if (element.rotate) {
			const angle = (element.rotate * Math.PI) / 180;

			ctx.save();

			ctx.translate(x + element.width / 2 / scale, y + element.height / 2 / scale);

			ctx.rotate(angle);

			ctx.translate(-element.width / 2 / scale, -element.height / 2 / scale);

			x = 0;
			y = 0;
		}

		if (element.type == 'text') {
			ctx.font = `${element.fontSize / scale}px "${element.fontFamily}"`;
			ctx.fillStyle = element.color;

			drawText(ctx, element.content, x, y, {
				align: element.align,
				justify: element.justify,
				vertical: element.vertical,
				width: element.width / scale,
				lineHeight: element.lineHeight / scale,
			});
		} else if (element.type == 'image' && element.image != null && element.image?.src) {
			ctx.drawImage(element.image, x, y, element.width / scale, element.height / scale);
		} else if (element.type == 'image' && (element.image == null || (element.image != null && !element.image.src))) {
			ctx.fillStyle = customization.emptyImageBackgroundColor || customizationSettings.emptyImageBackgroundColor;
			ctx.fillRect(x, y, element.width / scale, element.height / scale);
		} else if (element.type == 'figure') {
			let firgure = new Path2D();

			switch (element.figure) {
				case 'circle': {
					firgure.moveTo(x + element.width / scale, y + element.width / 2 / scale);
					firgure.arc(x + element.width / 2 / scale, y + element.width / 2 / scale, element.width / 2 / scale, 0, 2 * Math.PI);

					break;
				}
				case 'rectangle': {
					firgure.rect(x, y, element.width / scale, element.height / scale);

					break;
				}
			}

			ctx.fillStyle = element.color;
			ctx.fill(firgure);
		} else if (element.type == 'background') {
			ctx.fillStyle = element.color;
			ctx.fillRect(0, 0, width / scale, height / scale);
		} else if (element.type == 'canvas') {
			if (element.image) ctx.drawImage(element.image, x, y, element.width / scale, element.height / scale);

			for (let path of element.paths) {
				ctx.lineWidth = path.brushWidth;
				ctx.strokeStyle = path.color;
				ctx.lineCap = 'round';

				for (let p = 0; p < path.positions.length; p++) {
					ctx.beginPath();

					ctx.moveTo(path.positions[Math.max(p - 1, 0)].x, path.positions[Math.max(p - 1, 0)].y);
					ctx.lineTo(path.positions[p].x, path.positions[p].y);

					ctx.stroke();
				}
			}
		}

		if (element.rotate) ctx.restore();
	}
};
