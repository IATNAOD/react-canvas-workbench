export default ({
	ctx,
	width,
	height,
	canvas,
	mouseX,
	mouseY,
	elements,
	settings,
	getHandles,
	customization,
	snappedPosition,
	hoveredElementIndex,
	selectedElementIndex,
	customizationSettings,
}) => {
	// set default settings
	if (!settings) settings = { showMiddleLines: true, rotateHandleSize: 16, handleSize: 8, snap: 10 };

	const scale = width / 1600;

	canvas.width = width / scale;
	canvas.height = height / scale;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// set default vars
	let hoveredElement = null;
	let selectedElement = null;

	if (selectedElementIndex != null) {
		// upadte selectedElement
		selectedElement = elements[selectedElementIndex];
	}

	if (hoveredElementIndex != null) {
		// upadte hoveredElement
		hoveredElement = elements[hoveredElementIndex];
	}

	if (selectedElement && selectedElement.type == 'canvas') {
		ctx.strokeStyle = customization.brushBorderColor || customizationSettings.brushBorderColor;
		ctx.lineWidth = customization.brushBorderWidth || customizationSettings.brushBorderWidth;

		ctx.beginPath();
		ctx.arc(mouseX, mouseY, selectedElement.brushWidth / 2, 0, Math.PI * 2);
		ctx.stroke();
	} else {
		if (selectedElement && selectedElement.visible) {
			let x = selectedElement.x / scale;
			let y = selectedElement.y / scale;

			const angle = (selectedElement.rotate * Math.PI) / 180;

			ctx.save();

			if (selectedElement.rotate) {
				ctx.translate(x + selectedElement.width / 2 / scale, y + selectedElement.height / 2 / scale);

				ctx.rotate(angle);

				ctx.translate(-selectedElement.width / 2 / scale, -selectedElement.height / 2 / scale);

				x = 0;
				y = 0;
			}

			ctx.strokeStyle = customization.selectedElementBorderColor || customizationSettings.selectedElementBorderColor;
			ctx.lineWidth = customization.selectedElementBorderWidth || customizationSettings.selectedElementBorderWidth;

			ctx.setLineDash([]);
			ctx.strokeRect(x, y, selectedElement.width / scale, selectedElement.height / scale);

			ctx.restore();

			const handles = getHandles({
				scale,
				x: selectedElement.x,
				y: selectedElement.y,
				type: selectedElement.type,
				width: selectedElement.width,
				height: selectedElement.height,
				rotate: selectedElement.rotate,
			});

			Object.entries(handles).forEach(([name, { x, y }]) => {
				ctx.save();

				if (selectedElement.rotate) {
					const angle = (selectedElement.rotate * Math.PI) / 180;

					ctx.translate(x, y);
					ctx.rotate(angle);

					x = 0;
					y = 0;
				}

				if (name == 'rotate') {
					ctx.lineWidth = customization.rotateHandleBorderWidth || customizationSettings.rotateHandleBorderWidth;
					ctx.strokeStyle = customization.rotateHandleBorderColor || customizationSettings.rotateHandleBorderColor;
					ctx.fillStyle = customization.rotateHandleBackgroundColor || customizationSettings.rotateHandleBackgroundColor;

					const circle = new Path2D();

					circle.moveTo(x, y);
					circle.arc(x, y, settings.rotateHandleSize / 2, 0, 2 * Math.PI);

					ctx.stroke(circle);
					ctx.fill(circle);
				} else {
					ctx.lineWidth = customization.resizeHandleBorderWidth || customizationSettings.resizeHandleBorderWidth;
					ctx.strokeStyle = customization.resizeHandleBorderColor || customizationSettings.resizeHandleBorderColor;
					ctx.fillStyle = customization.resizeHandleBackgroundColor || customizationSettings.resizeHandleBackgroundColor;

					ctx.fillRect(x - settings.handleSize / 2, y - settings.handleSize / 2, settings.handleSize, settings.handleSize);
					ctx.strokeRect(x - settings.handleSize / 2, y - settings.handleSize / 2, settings.handleSize, settings.handleSize);
				}

				ctx.restore();
			});
		}

		if (hoveredElement && hoveredElement.visible && hoveredElementIndex !== selectedElementIndex) {
			let x = hoveredElement.x / scale;
			let y = hoveredElement.y / scale;

			const angle = (hoveredElement.rotate * Math.PI) / 180;

			ctx.save();

			if (hoveredElement.rotate) {
				ctx.translate(x + hoveredElement.width / 2 / scale, y + hoveredElement.height / 2 / scale);

				ctx.rotate(angle);

				ctx.translate(-hoveredElement.width / 2 / scale, -hoveredElement.height / 2 / scale);

				x = 0;
				y = 0;
			}

			ctx.lineWidth = customization.hoveredElementBorderWidth || customizationSettings.hoveredElementBorderWidth;
			ctx.strokeStyle = customization.hoveredElementBorderColor || customizationSettings.hoveredElementBorderColor;

			ctx.setLineDash([8, 8]);
			ctx.strokeRect(x, y, hoveredElement.width / scale, hoveredElement.height / scale);

			ctx.restore();
		}
	}

	if (selectedElement && snappedPosition) {
		ctx.save();

		ctx.setLineDash([0, 0]);
		ctx.lineWidth = customization.snapLineWidth || customizationSettings.snapLineWidth;
		ctx.strokeStyle = customization.snapLineColor || customizationSettings.snapLineColor;

		for (const line of snappedPosition.snapLines) {
			if (line.center) {
				if (line.axis === 'x') {
					ctx.beginPath();
					ctx.moveTo(line.from.x / scale - 1, 0);
					ctx.lineTo(line.from.x / scale - 1, canvas.height);
					ctx.stroke();
				} else if (line.axis === 'y') {
					ctx.beginPath();
					ctx.moveTo(0, line.from.y / scale - 1);
					ctx.lineTo(canvas.width, line.from.y / scale - 1);
					ctx.stroke();
				}
			} else {
				ctx.beginPath();
				ctx.moveTo(line.from.x / scale, line.from.y / scale);
				ctx.lineTo(line.to.x / scale, line.to.y / scale);
				ctx.stroke();
			}
		}

		ctx.restore();
	}

	if (settings.showMiddleLines) {
		ctx.save();

		ctx.setLineDash([2, 2]);
		ctx.lineWidth = customization.middleLinesColor || customizationSettings.middleLinesColor;
		ctx.strokeStyle = customization.middleLinesWidth || customizationSettings.middleLinesWidth;

		ctx.beginPath();
		ctx.moveTo(width / 2 / scale - 1, 0);
		ctx.lineTo(width / 2 / scale - 1, height / scale);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(0, height / 2 / scale - 1);
		ctx.lineTo(width / scale, height / 2 / scale - 1);
		ctx.stroke();

		ctx.restore();
	}
};
