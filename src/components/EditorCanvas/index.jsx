import './style.sass';

import classNames from 'classnames';
import React from 'react';

import { useReduxDispatch, useReduxState } from '../../hooks/useRedux';
import { drawContent, drawTools } from '../../utils/canvas';

import {
	redoHistory,
	undoHistory,
	saveStateToHistory,
	changeEditorContentField,
	changeEditorContentFields,
} from '../../store/actions/editor';

export default ({ background = 'transparent', onPreviewChange = () => {} }) => {
	const selectedElement = useReduxState((s) => s.editorManager.content.selectedElement);
	const canvasHeight = useReduxState((s) => s.editorManager.content.height);
	const historyIndex = useReduxState((s) => s.editorManager.history.index);
	const elements = useReduxState((s) => s.editorManager.content.elements);
	const canvasWidth = useReduxState((s) => s.editorManager.content.width);
	const canUndo = useReduxState((s) => s.editorManager.history.canUndo);
	const canRedo = useReduxState((s) => s.editorManager.history.canRedo);
	const history = useReduxState((s) => s.editorManager.history.list);
	const settings = useReduxState((s) => s.editorManager.settings);
	const dispatch = useReduxDispatch();

	const DragStateRef = React.useRef({
		isDragging: false,
		isResizing: false,
		isRotating: false,
		isDrawing: false,
		isShift: false,
		handle: '',
		offsetX: 0,
		offsetY: 0,
		startX: 0,
		startY: 0,
		startElementX: 0,
		startElementY: 0,
		startElementWidth: 0,
		startElementHeight: 0,
		startElementRotate: 0,
	});
	const SelectedElementIndexRef = React.useRef(null);
	const HoveredElementIndexRef = React.useRef(null);
	const SupportCanvasCtxRef = React.useRef();
	const ContentCanvasCtxRef = React.useRef();
	const ToolsCanvasCtxRef = React.useRef();
	const ContentCanvasRef = React.useRef();
	const SupportCanvasRef = React.useRef();
	const ToolsCanvasRef = React.useRef();
	const ElementsRef = React.useRef([]);

	const snapToStep = (value, step) => Math.round(value / step) * step;

	const getCenter = (element, scale = 1) => ({
		x: (element.x + element.width / 2) / scale,
		y: (element.y + element.height / 2) / scale,
	});

	const getHandles = ({ x, y, type, width, height, rotate, scale = 1 }) => {
		const rad = (rotate * Math.PI) / 180;

		const locals = {
			rotate: { x: 0, y: -height / 2 - settings.rotatehandleOffset },
			nw: { x: -width / 2, y: -height / 2 },
			...(type != 'text' ? { n: { x: 0, y: -height / 2 } } : {}),
			ne: { x: width / 2, y: -height / 2 },
			e: { x: width / 2, y: 0 },
			se: { x: width / 2, y: height / 2 },
			...(type != 'text' ? { s: { x: 0, y: height / 2 } } : {}),
			sw: { x: -width / 2, y: height / 2 },
			w: { x: -width / 2, y: 0 },
		};

		const handles = {};
		const cx = x + width / 2;
		const cy = y + height / 2;

		for (let [name, { x: lx, y: ly }] of Object.entries(locals)) {
			handles[name] = {
				x: (cx + lx * Math.cos(rad) - ly * Math.sin(rad)) / scale,
				y: (cy + lx * Math.sin(rad) + ly * Math.cos(rad)) / scale,
			};
		}

		return handles;
	};

	const elementHoverTest = (mouseX, mouseY, element, scale = 1) => {
		const { x: elementCenterX, y: elementCenterY } = getCenter(element, scale);

		const dx = mouseX - elementCenterX;
		const dy = mouseY - elementCenterY;

		const rad = (-element.rotate * Math.PI) / 180;

		const tx = dx * Math.cos(rad) - dy * Math.sin(rad);
		const ty = dx * Math.sin(rad) + dy * Math.cos(rad);

		return (
			tx >= -element.width / 2 / scale &&
			tx <= element.width / 2 / scale &&
			ty >= -element.height / 2 / scale &&
			ty <= element.height / 2 / scale
		);
	};

	const handleHoverTest = (mouseX, mouseY, handles) => {
		return Object.entries(handles).find(
			([name, { x, y }]) =>
				(name == 'rotate' &&
					mouseX >= x - settings.rotateHandleSize / 2 &&
					mouseX <= x + settings.rotateHandleSize / 2 &&
					mouseY >= y - settings.rotateHandleSize / 2 &&
					mouseY <= y + settings.rotateHandleSize / 2) ||
				(name != 'rotate' &&
					mouseX >= x - settings.handleSize / 2 &&
					mouseX <= x + settings.handleSize / 2 &&
					mouseY >= y - settings.handleSize / 2 &&
					mouseY <= y + settings.handleSize / 2)
		);
	};

	const getMousePosition = (e) => {
		const rect = ToolsCanvasRef.current.getBoundingClientRect();

		const canvasRealSizeScale = ToolsCanvasRef.current.clientWidth / ToolsCanvasRef.current.width;

		return { mouseX: (e.clientX - rect.left) / canvasRealSizeScale, mouseY: (e.clientY - rect.top) / canvasRealSizeScale };
	};

	const handleToolsCanvasMouseMove = (e) => {
		if (!ElementsRef.current) return;

		const { mouseX, mouseY } = getMousePosition(e);

		if (DragStateRef.current.isDrawing && SelectedElementIndexRef.current != null) {
			const element = ElementsRef.current[SelectedElementIndexRef.current];

			ElementsRef.current[SelectedElementIndexRef.current].paths[element.paths.length - 1].positions.push({
				x: mouseX,
				y: mouseY,
			});

			if (ElementsRef.current && ContentCanvasRef.current && ContentCanvasCtxRef.current) {
				drawContent({
					width: canvasWidth,
					height: canvasHeight,
					elements: ElementsRef.current,
					canvas: ContentCanvasRef.current,
					ctx: ContentCanvasCtxRef.current,
				});
			}

			if (ElementsRef.current && ToolsCanvasRef.current && ToolsCanvasCtxRef.current) {
				drawTools({
					mouseX,
					mouseY,
					getHandles,
					width: canvasWidth,
					height: canvasHeight,
					elements: ElementsRef.current,
					canvas: ToolsCanvasRef.current,
					ctx: ToolsCanvasCtxRef.current,
					showMiddleLines: settings.showMiddleLines,
					hoveredElementIndex: HoveredElementIndexRef.current,
					selectedElementIndex: SelectedElementIndexRef.current,
				});
			}
		} else if (DragStateRef.current.isRotating && SelectedElementIndexRef.current != null) {
			const element = ElementsRef.current[SelectedElementIndexRef.current];

			const scale = canvasWidth / 1600;

			const { x: elementCenterX, y: elementCenterY } = getCenter(element, scale);

			const rotate = (Math.atan2(mouseY - elementCenterY, mouseX - elementCenterX) * 180) / Math.PI;

			const newRotate = snapToStep(
				rotate - DragStateRef.current.startElementRotate,
				DragStateRef.current.isShift || e.shiftKey ? 45 : 1
			);

			ElementsRef.current[SelectedElementIndexRef.current].rotate = newRotate;

			if (ElementsRef.current && ContentCanvasRef.current && ContentCanvasCtxRef.current) {
				drawContent({
					width: canvasWidth,
					height: canvasHeight,
					elements: ElementsRef.current,
					canvas: ContentCanvasRef.current,
					ctx: ContentCanvasCtxRef.current,
				});
			}

			if (ElementsRef.current && ToolsCanvasRef.current && ToolsCanvasCtxRef.current) {
				drawTools({
					mouseX,
					mouseY,
					getHandles,
					width: canvasWidth,
					height: canvasHeight,
					elements: ElementsRef.current,
					canvas: ToolsCanvasRef.current,
					ctx: ToolsCanvasCtxRef.current,
					showMiddleLines: settings.showMiddleLines,
					hoveredElementIndex: HoveredElementIndexRef.current,
					selectedElementIndex: SelectedElementIndexRef.current,
				});
			}
		} else if (DragStateRef.current.isResizing && SelectedElementIndexRef.current != null) {
			const element = ElementsRef.current[SelectedElementIndexRef.current];

			const {
				handle,
				isShift,
				startX,
				startY,
				startElementX,
				startElementY,
				startElementWidth,
				startElementHeight,
				startElementRotate,
			} = DragStateRef.current;

			const scale = canvasWidth / 1600;

			const globalMouseDeltaX = mouseX - startX;
			const globalMouseDeltaY = mouseY - startY;

			const rad = (-startElementRotate * Math.PI) / 180;

			const localMouseDeltaX = globalMouseDeltaX * Math.cos(rad) - globalMouseDeltaY * Math.sin(rad);
			const localMouseDeltaY = globalMouseDeltaX * Math.sin(rad) + globalMouseDeltaY * Math.cos(rad);

			let newX = startElementX;
			let newY = startElementY;
			let newWidth = startElementWidth;
			let newHeight = startElementHeight;
			let newFontSize = element.fontSize;

			if (handle.includes('n')) {
				newY = startElementY + localMouseDeltaY * scale;
				newHeight = startElementHeight - localMouseDeltaY * scale;
			}

			if (handle.includes('s')) {
				newHeight = startElementHeight + localMouseDeltaY * scale;
			}

			if (handle.includes('e')) {
				newWidth = startElementWidth + localMouseDeltaX * scale;
			}

			if (handle.includes('w')) {
				newX = startElementX + localMouseDeltaX * scale;
				newWidth = startElementWidth - localMouseDeltaX * scale;
			}

			let lines = [];

			if (element.type == 'text') {
				ContentCanvasCtxRef.current.font = `${element.fontSize}px "${element.fontFamily}"`;
				ContentCanvasCtxRef.current.fillStyle = element.color;

				const words = element.content.split(' ');
				let line = '';

				for (let i = 0; i < words.length; i++) {
					if (words[i].includes('\n')) {
						const splitedWords = words[i].split('\n');

						for (let l = 0; l < splitedWords.length; l++) {
							if (l > 0) {
								lines.push(line.trim());

								line = '';
							}

							line += splitedWords[l] + ' ';
						}

						continue;
					}

					let testLine = line + words[i] + ' ';

					let testLineWidth = ContentCanvasCtxRef.current.measureText(testLine).width;

					if (testLineWidth > element.width && line !== '') {
						lines.push(line.trim());

						line = words[i] + ' ';
					} else {
						line = testLine;
					}
				}

				lines.push(line.trim());
			}

			if (isShift || e.shiftKey) {
				const ratio =
					handle.includes('w') || handle.includes('e') ? newWidth / startElementWidth : newHeight / startElementHeight;

				newWidth = startElementWidth * ratio;
				newHeight = startElementHeight * ratio;

				if (handle.includes('n')) {
					newY = startElementY + (startElementWidth - newWidth);
				}

				if (handle.includes('w')) {
					newX = startElementX + (startElementHeight - newHeight);
				}

				if (element.type == 'text') {
					newFontSize = newHeight / lines.length;
				}
			} else if (element.type == 'text') {
				newHeight = lines.length * element.lineHeight;
			}

			const elementCenterX = startElementX + startElementWidth / 2;
			const elementCenterY = startElementY + startElementHeight / 2;

			let localDeltaCenterX = 0;
			let localDeltaCenterY = 0;

			if (handle.includes('e')) {
				localDeltaCenterX = (newWidth - startElementWidth) / 2;
			}

			if (handle.includes('w')) {
				localDeltaCenterX = -(newWidth - startElementWidth) / 2;
			}

			if (handle.includes('s')) {
				localDeltaCenterY = (newHeight - startElementHeight) / 2;
			}

			if (handle.includes('n')) {
				localDeltaCenterY = -(newHeight - startElementHeight) / 2;
			}

			const cosA = Math.cos((startElementRotate * Math.PI) / 180);
			const sinA = Math.sin((startElementRotate * Math.PI) / 180);

			const globalDeltaCenterX = localDeltaCenterX * cosA - localDeltaCenterY * sinA;
			const globalDeltaCenterY = localDeltaCenterX * sinA + localDeltaCenterY * cosA;

			const newElementCenterX = elementCenterX + globalDeltaCenterX;
			const newElementCenterY = elementCenterY + globalDeltaCenterY;

			newX = newElementCenterX - newWidth / 2;
			newY = newElementCenterY - newHeight / 2;

			ElementsRef.current[SelectedElementIndexRef.current] = {
				...ElementsRef.current[SelectedElementIndexRef.current],
				...(newWidth > 40 ? { x: newX, width: newWidth } : {}),
				...(newHeight > 40 ? { y: newY, height: newHeight } : {}),
				...(element.type == 'text' ? { fontSize: newFontSize, lineHeight: newFontSize } : {}),
			};

			if (ElementsRef.current && ContentCanvasRef.current && ContentCanvasCtxRef.current) {
				drawContent({
					width: canvasWidth,
					height: canvasHeight,
					elements: ElementsRef.current,
					canvas: ContentCanvasRef.current,
					ctx: ContentCanvasCtxRef.current,
				});
			}

			if (ElementsRef.current && ToolsCanvasRef.current && ToolsCanvasCtxRef.current) {
				drawTools({
					mouseX,
					mouseY,
					getHandles,
					width: canvasWidth,
					height: canvasHeight,
					elements: ElementsRef.current,
					canvas: ToolsCanvasRef.current,
					ctx: ToolsCanvasCtxRef.current,
					showMiddleLines: settings.showMiddleLines,
					hoveredElementIndex: HoveredElementIndexRef.current,
					selectedElementIndex: SelectedElementIndexRef.current,
				});
			}
		} else if (DragStateRef.current.isDragging && SelectedElementIndexRef.current != null) {
			const element = ElementsRef.current[SelectedElementIndexRef.current];

			let newX = (mouseX - DragStateRef.current.offsetX) * (canvasWidth / 1600);
			let newY = (mouseY - DragStateRef.current.offsetY) * (canvasWidth / 1600);

			if (!DragStateRef.current.isShift && element.rotate % 180 == 0) {
				const scale = canvasWidth / 1600;

				// left canvas edge
				if (Math.abs(newX) < settings.snap) {
					newX = 0;
				}

				// top canvas edge
				if (Math.abs(newY) < settings.snap) {
					newY = 0;
				}

				// right canvas edge
				if (Math.abs((newX + element.width) / scale - ToolsCanvasRef.current.width) < settings.snap) {
					newX = ToolsCanvasRef.current.width * scale - element.width;
				}

				// bottom canvas edge
				if (Math.abs((newY + element.height) / scale - ToolsCanvasRef.current.height) < settings.snap) {
					newY = ToolsCanvasRef.current.height * scale - element.height;
				}

				// right canvas top-bottom middle line
				if (Math.abs(newX / scale - ToolsCanvasRef.current.width / 2) < settings.snap) {
					newX = (ToolsCanvasRef.current.width / 2) * scale;
				}

				// left canvas top-bottom middle line
				if (Math.abs((newX + element.width) / scale - ToolsCanvasRef.current.width / 2) < settings.snap) {
					newX = (ToolsCanvasRef.current.width / 2) * scale - element.width;
				}

				// right canvas left-right middle line
				if (Math.abs(newY / scale - ToolsCanvasRef.current.height / 2) < settings.snap) {
					newY = (ToolsCanvasRef.current.height / 2) * scale;
				}

				// left canvas left-right middle line
				if (Math.abs((newY + element.height) / scale - ToolsCanvasRef.current.height / 2) < settings.snap) {
					newY = (ToolsCanvasRef.current.height / 2) * scale - element.height;
				}

				// left canvas top-bottom middle line
				if (Math.abs((newX + element.width / 2) / scale - ToolsCanvasRef.current.width / 2) < settings.snap) {
					newX = (ToolsCanvasRef.current.width / 2) * scale - element.width / 2;
				}

				// left canvas left-right middle line
				if (Math.abs((newY + element.height / 2) / scale - ToolsCanvasRef.current.height / 2) < settings.snap) {
					newY = (ToolsCanvasRef.current.height / 2) * scale - element.height / 2;
				}

				ElementsRef.current.forEach((other, index) => {
					if (index == SelectedElementIndexRef.current) return;

					if (Math.abs((newX - (other.x + other.width)) / scale) < settings.snap) {
						newX = other.x + other.width;
					}

					if (Math.abs((newX + element.width - other.x) / scale) < settings.snap) {
						newX = other.x - element.width;
					}

					if (Math.abs((newX - other.x) / scale) < settings.snap) {
						newX = other.x;
					}

					if (Math.abs((newX + element.width - (other.x + other.width)) / scale) < settings.snap) {
						newX = other.x + (other.width - element.width);
					}

					if (Math.abs((newY - (other.y + other.height)) / scale) < settings.snap) {
						newY = other.y + other.height;
					}

					if (Math.abs((newY + element.height - other.y) / scale) < settings.snap) {
						newY = other.y - element.height;
					}

					if (Math.abs((newY - other.y) / scale) < settings.snap) {
						newY = other.y;
					}

					if (Math.abs((newY + element.height - (other.y + other.height)) / scale) < settings.snap) {
						newY = other.y + (other.height - element.height);
					}

					if (Math.abs((newX + element.width / 2 - (other.x + other.width / 2)) / scale) < settings.snap) {
						newX = other.x + (other.width / 2 - element.width / 2);
					}

					if (Math.abs((newY + element.height / 2 - (other.y + other.height / 2)) / scale) < settings.snap) {
						newY = other.y + (other.height / 2 - element.height / 2);
					}

					if (Math.abs((newX - (other.x + other.width / 2)) / scale) < settings.snap) {
						newX = other.x + other.width / 2;
					}

					if (Math.abs((newY - (other.y + other.height / 2)) / scale) < settings.snap) {
						newY = other.y + other.height / 2;
					}

					if (Math.abs((newX + element.width - (other.x + other.width / 2)) / scale) < settings.snap) {
						newX = other.x + other.width / 2 - element.width;
					}

					if (Math.abs((newY + element.height - (other.y + other.height / 2)) / scale) < settings.snap) {
						newY = other.y + other.height / 2 - element.height;
					}
				});
			}

			ElementsRef.current[SelectedElementIndexRef.current] = {
				...ElementsRef.current[SelectedElementIndexRef.current],
				x: newX,
				y: newY,
			};

			if (ElementsRef.current && ContentCanvasRef.current && ContentCanvasCtxRef.current) {
				drawContent({
					width: canvasWidth,
					height: canvasHeight,
					elements: ElementsRef.current,
					canvas: ContentCanvasRef.current,
					ctx: ContentCanvasCtxRef.current,
				});
			}

			if (ElementsRef.current && ToolsCanvasRef.current && ToolsCanvasCtxRef.current) {
				drawTools({
					mouseX,
					mouseY,
					getHandles,
					width: canvasWidth,
					height: canvasHeight,
					elements: ElementsRef.current,
					canvas: ToolsCanvasRef.current,
					ctx: ToolsCanvasCtxRef.current,
					showMiddleLines: settings.showMiddleLines,
					hoveredElementIndex: HoveredElementIndexRef.current,
					selectedElementIndex: SelectedElementIndexRef.current,
				});
			}
		} else {
			for (let i = ElementsRef.current.length - 1; i >= 0; i--) {
				if (
					elementHoverTest(mouseX, mouseY, ElementsRef.current[i], canvasWidth / 1600) &&
					(!SelectedElementIndexRef.current ||
						(SelectedElementIndexRef.current && i == SelectedElementIndexRef.current) ||
						!ElementsRef.current[SelectedElementIndexRef.current] ||
						!elementHoverTest(mouseX, mouseY, ElementsRef.current[SelectedElementIndexRef.current], canvasWidth / 1600))
				) {
					HoveredElementIndexRef.current = i;

					break;
				} else {
					HoveredElementIndexRef.current = null;
				}
			}
		}

		if (ElementsRef.current && ToolsCanvasRef.current && ToolsCanvasCtxRef.current) {
			drawTools({
				mouseX,
				mouseY,
				getHandles,
				width: canvasWidth,
				height: canvasHeight,
				elements: ElementsRef.current,
				canvas: ToolsCanvasRef.current,
				ctx: ToolsCanvasCtxRef.current,
				showMiddleLines: settings.showMiddleLines,
				hoveredElementIndex: HoveredElementIndexRef.current,
				selectedElementIndex: SelectedElementIndexRef.current,
			});
		}
	};

	const handleToolsCanvasMouseDown = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const { mouseX, mouseY } = getMousePosition(event);

		if (event.button != 0) {
			SelectedElementIndexRef.current = null;

			dispatch(changeEditorContentFields({ updater: { selectedElement: null, selectedElementId: null } }));

			if (ElementsRef.current && ToolsCanvasRef.current && ToolsCanvasCtxRef.current) {
				drawTools({
					mouseX,
					mouseY,
					getHandles,
					width: canvasWidth,
					height: canvasHeight,
					elements: ElementsRef.current,
					canvas: ToolsCanvasRef.current,
					ctx: ToolsCanvasCtxRef.current,
					showMiddleLines: settings.showMiddleLines,
					hoveredElementIndex: HoveredElementIndexRef.current,
					selectedElementIndex: SelectedElementIndexRef.current,
				});
			}

			return;
		}

		ElementsRef.current = elements.map((element) =>
			selectedElement && element.id == selectedElement.id ? selectedElement : element
		);

		if (
			HoveredElementIndexRef.current != null &&
			(SelectedElementIndexRef.current == null ||
				(HoveredElementIndexRef.current != SelectedElementIndexRef.current &&
					ElementsRef.current[SelectedElementIndexRef.current]?.type != 'canvas'))
		) {
			SelectedElementIndexRef.current = HoveredElementIndexRef.current;

			dispatch(
				changeEditorContentFields({
					updater: {
						selectedElement: ElementsRef.current[SelectedElementIndexRef.current],
						selectedElementId: ElementsRef.current[SelectedElementIndexRef.current].id,
					},
				})
			);
		}

		if (SelectedElementIndexRef.current == null) return;

		const element = ElementsRef.current[SelectedElementIndexRef.current];

		if (element.locked) return;

		if (element.type == 'canvas') {
			DragStateRef.current = {
				...DragStateRef.current,
				isDrawing: true,
			};

			ElementsRef.current[SelectedElementIndexRef.current].paths.push({
				color: element.color,
				brushWidth: element.brushWidth,
				positions: [{ x: mouseX, y: mouseY }],
			});
		} else {
			const handles = getHandles({
				x: element.x,
				y: element.y,
				type: element.type,
				width: element.width,
				height: element.height,
				rotate: element.rotate,
				scale: canvasWidth / 1600,
			});

			const handleHovered = handleHoverTest(mouseX, mouseY, handles);

			if (handleHovered) {
				if (handleHovered[0] == 'rotate') {
					const { x: elementCenterX, y: elementCenterY } = getCenter(element, canvasWidth / 1600);

					const startElementRotate =
						(Math.atan2(mouseY - elementCenterY, mouseX - elementCenterX) * 180) / Math.PI - element.rotate;

					DragStateRef.current = {
						...DragStateRef.current,
						isRotating: true,
						startElementRotate,
						isShift: event.shiftKey,
					};
				} else {
					DragStateRef.current = {
						...DragStateRef.current,
						startX: mouseX,
						startY: mouseY,
						isResizing: true,
						handle: handleHovered[0],
						startElementX: element.x,
						startElementY: element.y,
						startElementWidth: element.width,
						startElementHeight: element.height,
						startElementRotate: element.rotate,
						isShift:
							event.shiftKey ||
							(element.type == 'text' && handleHovered[0].length == 2) ||
							(element.type == 'figure' && element.figure == 'circle'),
					};
				}
			} else {
				DragStateRef.current = {
					...DragStateRef.current,
					isDragging: true,
					isShift: event.shiftKey,
					startElementX: element.x,
					startElementY: element.y,
					offsetX: mouseX - element.x / (canvasWidth / 1600),
					offsetY: mouseY - element.y / (canvasWidth / 1600),
				};
			}
		}

		if (ElementsRef.current && ToolsCanvasRef.current && ToolsCanvasCtxRef.current) {
			drawTools({
				mouseX,
				mouseY,
				getHandles,
				width: canvasWidth,
				height: canvasHeight,
				elements: ElementsRef.current,
				canvas: ToolsCanvasRef.current,
				ctx: ToolsCanvasCtxRef.current,
				showMiddleLines: settings.showMiddleLines,
				hoveredElementIndex: HoveredElementIndexRef.current,
				selectedElementIndex: SelectedElementIndexRef.current,
			});
		}
	};

	const handleToolsCanvasMouseUp = async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const { mouseX, mouseY } = getMousePosition(event);

		if (
			HoveredElementIndexRef.current == null &&
			SelectedElementIndexRef.current != null &&
			DragStateRef.current.isDragging &&
			event.button == 0
		) {
			SelectedElementIndexRef.current = null;

			dispatch(changeEditorContentFields({ updater: { selectedElement: null, selectedElementId: null } }));

			if (ElementsRef.current && ToolsCanvasRef.current && ToolsCanvasCtxRef.current) {
				drawTools({
					mouseX,
					mouseY,
					getHandles,
					width: canvasWidth,
					height: canvasHeight,
					elements: ElementsRef.current,
					canvas: ToolsCanvasRef.current,
					ctx: ToolsCanvasCtxRef.current,
					showMiddleLines: settings.showMiddleLines,
					hoveredElementIndex: HoveredElementIndexRef.current,
					selectedElementIndex: SelectedElementIndexRef.current,
				});
			}
		}

		if (DragStateRef.current.isDrawing) {
			ElementsRef.current[SelectedElementIndexRef.current].paths = ElementsRef.current[
				SelectedElementIndexRef.current
			].paths.filter((p) => p.positions.length);

			drawContent({
				width: canvasWidth,
				height: canvasHeight,
				canvas: SupportCanvasRef.current,
				ctx: SupportCanvasCtxRef.current,
				elements: [ElementsRef.current[SelectedElementIndexRef.current]],
			});

			const contentCoverDataUrl = SupportCanvasRef.current.toDataURL('image/png', 1);

			let image = new Image();

			image.src = contentCoverDataUrl;

			await new Promise((resolve) => (image.onload = () => resolve()));

			ElementsRef.current[SelectedElementIndexRef.current] = {
				...ElementsRef.current[SelectedElementIndexRef.current],
				paths: [],
				image,
			};
		}

		if (
			DragStateRef.current.isDragging ||
			DragStateRef.current.isResizing ||
			DragStateRef.current.isRotating ||
			DragStateRef.current.isDrawing
		) {
			DragStateRef.current = {
				...DragStateRef.current,
				isDragging: false,
				isResizing: false,
				isRotating: false,
				isDrawing: false,
			};

			dispatch(changeEditorContentField({ name: 'elements', value: ElementsRef.current }));
		}

		if (ContentCanvasRef.current) {
			const contentCoverDataUrl = ContentCanvasRef.current.toDataURL('image/jpeg', 1);

			onPreviewChange(contentCoverDataUrl);
		}
	};

	const handleToolsCanvasMouseOut = async () => {
		HoveredElementIndexRef.current = null;

		if (ElementsRef.current && ToolsCanvasRef.current && ToolsCanvasCtxRef.current) {
			drawTools({
				getHandles,
				width: canvasWidth,
				height: canvasHeight,
				elements: ElementsRef.current,
				canvas: ToolsCanvasRef.current,
				ctx: ToolsCanvasCtxRef.current,
				showMiddleLines: settings.showMiddleLines,
				hoveredElementIndex: HoveredElementIndexRef.current,
				selectedElementIndex: SelectedElementIndexRef.current,
			});
		}

		if (DragStateRef.current.isDrawing) {
			ElementsRef.current[SelectedElementIndexRef.current].paths = ElementsRef.current[
				SelectedElementIndexRef.current
			].paths.filter((p) => p.positions.length);

			drawContent({
				width: canvasWidth,
				height: canvasHeight,
				canvas: SupportCanvasRef.current,
				ctx: SupportCanvasCtxRef.current,
				elements: [ElementsRef.current[SelectedElementIndexRef.current]],
			});

			const contentCoverDataUrl = SupportCanvasRef.current.toDataURL('image/png', 1);

			let image = new Image();

			image.src = contentCoverDataUrl;

			await new Promise((resolve) => (image.onload = () => resolve()));

			ElementsRef.current[SelectedElementIndexRef.current] = {
				...ElementsRef.current[SelectedElementIndexRef.current],
				paths: [],
				image,
			};

			ToolsCanvasCtxRef.current.clearRect(0, 0, ToolsCanvasRef.current.width, ToolsCanvasRef.current.height);
		}

		if (
			DragStateRef.current.isDragging ||
			DragStateRef.current.isResizing ||
			DragStateRef.current.isRotating ||
			DragStateRef.current.isDrawing
		) {
			DragStateRef.current = {
				...DragStateRef.current,
				isDragging: false,
				isResizing: false,
				isRotating: false,
				isDrawing: false,
			};

			dispatch(changeEditorContentField({ name: 'elements', value: ElementsRef.current }));
		}

		if (ContentCanvasRef.current) {
			const spreadCoverDataUrl = ContentCanvasRef.current.toDataURL('image/jpeg', 1);

			onPreviewChange(spreadCoverDataUrl);
		}
	};

	const handleDocumentKeyDown = (e) => {
		switch (e.key) {
			case 'ArrowUp':
			case 'ArrowRight':
			case 'ArrowDown':
			case 'ArrowLeft': {
				dispatch(
					changeEditorContentField({
						name: 'elements',
						value: ({ elements, selectedElement }) =>
							elements.map((element) =>
								selectedElement && element.id == selectedElement.id
									? {
											...selectedElement,
											x: selectedElement.x + settings.positionChangeByArrows[e.key].x * (e.shiftKey ? 10 : 1),
											y: selectedElement.y + settings.positionChangeByArrows[e.key].y * (e.shiftKey ? 10 : 1),
										}
									: element
							),
					})
				);

				break;
			}
			case 'z': {
				if (e.ctrlKey && e.altKey && canRedo) dispatch(redoHistory());
				else if (e.ctrlKey && !e.altKey && canUndo) dispatch(undoHistory());

				break;
			}
		}
	};

	React.useEffect(() => {
		document.addEventListener('keydown', handleDocumentKeyDown);

		return () => {
			document.removeEventListener('keydown', handleDocumentKeyDown);
		};
	}, [canUndo, canRedo]);

	React.useEffect(() => {
		ElementsRef.current = elements;

		if (ElementsRef.current && SelectedElementIndexRef.current && !ElementsRef.current[SelectedElementIndexRef.current]) {
			SelectedElementIndexRef.current = null;
		}

		if (ElementsRef.current && ContentCanvasRef.current && ContentCanvasCtxRef.current) {
			drawContent({
				width: canvasWidth,
				height: canvasHeight,
				elements: ElementsRef.current,
				canvas: ContentCanvasRef.current,
				ctx: ContentCanvasCtxRef.current,
			});
		}

		if (ElementsRef.current && ContentCanvasRef.current && ContentCanvasCtxRef.current) {
			drawTools({
				getHandles,
				width: canvasWidth,
				height: canvasHeight,
				elements: ElementsRef.current,
				canvas: ToolsCanvasRef.current,
				ctx: ToolsCanvasCtxRef.current,
				showMiddleLines: settings.showMiddleLines,
				hoveredElementIndex: HoveredElementIndexRef.current,
				selectedElementIndex: SelectedElementIndexRef.current,
			});
		}

		if (selectedElement) {
			dispatch(
				changeEditorContentField({
					name: 'selectedElement',
					value: ({ elements, selectedElementId }) => elements.find((e) => e.id == selectedElementId),
				})
			);
		}

		if (JSON.stringify(elements) != JSON.stringify(history[historyIndex])) dispatch(saveStateToHistory({}));
	}, [elements, settings]);

	React.useEffect(() => {
		if (selectedElement) {
			ElementsRef.current = ElementsRef.current.map((element) => (element.id == selectedElement.id ? selectedElement : element));

			SelectedElementIndexRef.current = ElementsRef.current.findIndex((element) => element.id == selectedElement.id);
		} else {
			SelectedElementIndexRef.current = null;
		}

		if (ElementsRef.current && ContentCanvasRef.current && ContentCanvasCtxRef.current) {
			drawContent({
				width: canvasWidth,
				height: canvasHeight,
				elements: ElementsRef.current,
				canvas: ContentCanvasRef.current,
				ctx: ContentCanvasCtxRef.current,
			});
		}

		if (ElementsRef.current && ContentCanvasRef.current && ContentCanvasCtxRef.current) {
			drawTools({
				getHandles,
				width: canvasWidth,
				height: canvasHeight,
				elements: ElementsRef.current,
				canvas: ToolsCanvasRef.current,
				ctx: ToolsCanvasCtxRef.current,
				showMiddleLines: settings.showMiddleLines,
				hoveredElementIndex: HoveredElementIndexRef.current,
				selectedElementIndex: SelectedElementIndexRef.current,
			});
		}
	}, [selectedElement]);

	React.useEffect(() => {
		if (ContentCanvasRef.current && !ContentCanvasCtxRef.current) {
			ContentCanvasCtxRef.current = ContentCanvasRef.current.getContext('2d');
		}

		if (ToolsCanvasRef.current && !ToolsCanvasCtxRef.current) {
			ToolsCanvasCtxRef.current = ToolsCanvasRef.current.getContext('2d');
		}

		if (SupportCanvasRef.current && !SupportCanvasCtxRef.current) {
			SupportCanvasCtxRef.current = SupportCanvasRef.current.getContext('2d');
		}
	}, []);

	return (
		<div className={classNames({ 'editor-content-canvas-wrapper': true })}>
			<canvas
				width={1600}
				height={800}
				onMouseUp={handleToolsCanvasMouseUp}
				onMouseOut={handleToolsCanvasMouseOut}
				onMouseDown={handleToolsCanvasMouseDown}
				onMouseMove={handleToolsCanvasMouseMove}
				onContextMenu={(e) => {
					e.preventDefault();
					e.stopPropagation();

					return false;
				}}
				ref={(ref) => (ToolsCanvasRef.current = ref)}
				className={classNames({ 'editor-content-canvas-tools': true })}
			/>
			<canvas
				width={1600}
				height={800}
				style={{ background }}
				ref={(ref) => (ContentCanvasRef.current = ref)}
				className={classNames({ 'editor-content-canvas-content': true })}
			/>
			<canvas
				width={1600}
				height={800}
				ref={(ref) => (SupportCanvasRef.current = ref)}
				className={classNames({ 'editor-content-canvas-support': true })}
			/>
		</div>
	);
};
