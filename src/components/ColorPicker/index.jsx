import './style.sass';

import classNames from 'classnames';
import React from 'react';

import { toHex, hsvToRgb, rgbToHsv, getContrastColor } from '../../utils/colors';

export default ({ background = '#e4d4f4', color = '', onColorChange = () => {}, copyHexCallback = () => {} }) => {
	const [HSDragStared, SetHSDragStared] = React.useState(false);
	const [Saturation, SetSaturation] = React.useState(100);
	const [Hex, SetHex] = React.useState('#ff0000ff');
	const [Value, SetValue] = React.useState(100);
	const [Alpha, SetAlpha] = React.useState(100);
	const [Green, SetGreen] = React.useState(0);
	const [Blue, SetBlue] = React.useState(0);
	const [Red, SetRed] = React.useState(0);
	const [Hue, SetHue] = React.useState(0);
	const canvasRef = React.useRef(null);

	const drawCanvas = ({ hue = 0, saturation = 100, value = 100, alpha = 100, red = 0, green = 0, blue = 0 }) => {
		const ctx = canvasRef.current.getContext('2d');

		ctx.fillStyle = `hsl(${hue},100%,50%)`;
		ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

		const whiteGradient = ctx.createLinearGradient(0, 0, canvasRef.current.width, 0);
		whiteGradient.addColorStop(0, '#fff');
		whiteGradient.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = whiteGradient;
		ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

		const blackGradient = ctx.createLinearGradient(0, 0, 0, canvasRef.current.height);
		blackGradient.addColorStop(0, 'rgba(0,0,0,0)');
		blackGradient.addColorStop(1, '#000');
		ctx.fillStyle = blackGradient;
		ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

		const x = (saturation / 100) * canvasRef.current.width;
		const y = (1 - value / 100) * canvasRef.current.height;
		const normolizedAlpha = alpha / 100;

		ctx.beginPath();

		ctx.arc(x, y, 8, 0, 2 * Math.PI);

		ctx.fillStyle = '#fff';
		ctx.fill();

		ctx.beginPath();

		ctx.arc(x, y, 5, 0, 2 * Math.PI);

		ctx.fillStyle = `rgba(${red},${green},${blue},${normolizedAlpha})`;
		ctx.fill();
	};

	const onBlur = () => {
		onColorChange(Hex);
	};

	const updateThroughHue = (e) => {
		const hue = e.target.value;

		const [red, green, blue] = hsvToRgb(hue, Saturation, Value);

		SetHue(hue);

		SetRed(red);

		SetGreen(green);

		SetBlue(blue);

		SetHex(`#${toHex(red)}${toHex(green)}${toHex(blue)}${toHex(Math.round((Alpha / 100) * 255))}`);

		drawCanvas({ hue, saturation: Saturation, value: Value, alpha: Alpha, red, green, blue });
	};

	const updateThroughAlpha = (e) => {
		const alpha = e.target.value;

		SetAlpha(alpha);

		SetHex(`#${toHex(Red)}${toHex(Green)}${toHex(Blue)}${toHex(Math.round((alpha / 100) * 255))}`);

		drawCanvas({ hue: Hue, saturation: Saturation, value: Value, alpha, red: Red, green: Green, blue: Blue });
	};

	const updateThroughHS = (e) => {
		const { offsetX: x, offsetY: y } = e.nativeEvent;

		const saturation = (x / canvasRef.current.width) * 100;
		const value = (1 - y / canvasRef.current.height) * 100;

		const [red, green, blue] = hsvToRgb(Hue, saturation, value);

		SetRed(red);

		SetGreen(green);

		SetBlue(blue);

		SetSaturation(saturation);

		SetValue(value);

		SetHex(`#${toHex(red)}${toHex(green)}${toHex(blue)}${toHex(Math.round((Alpha / 100) * 255))}`);

		drawCanvas({ hue: Hue, saturation, value, alpha: Alpha, red, green, blue });
	};

	const updateThroughHex = (e) => {
		const hex = e.target.value;

		SetHex(hex);

		if (/^#([0-9A-Fa-f]{8})$/.test(hex)) {
			const red = parseInt(hex.slice(1, 3), 16);
			const green = parseInt(hex.slice(3, 5), 16);
			const blue = parseInt(hex.slice(5, 7), 16);
			const alpha = (parseInt(hex.slice(7, 9), 16) / 255) * 100;

			const [hue, saturation, value] = rgbToHsv(red, green, blue);

			SetRed(red);

			SetGreen(green);

			SetBlue(blue);

			SetAlpha(alpha);

			SetHue(Math.round(hue));

			SetSaturation(Math.round(saturation));

			SetValue(Math.round(value));

			drawCanvas({ hue, saturation, value, alpha, red, green, blue });
		}
	};

	const copyHex = () => {
		navigator.clipboard.writeText(Hex);

		copyHexCallback();
	};

	const updateThroughRGBA = (red, green, blue, alpha) => {
		const [hue, saturation, value] = rgbToHsv(red, green, blue);

		SetRed(red);

		SetGreen(green);

		SetBlue(blue);

		SetAlpha(alpha);

		SetHex(`#${toHex(red)}${toHex(green)}${toHex(blue)}${toHex(Math.round((alpha / 100) * 255))}`);

		SetHue(Math.round(hue));

		SetSaturation(Math.round(saturation));

		SetValue(Math.round(value));

		drawCanvas({ hue, saturation, value, alpha, red, green, blue });
	};

	React.useEffect(() => {
		canvasRef.current.width = canvasRef.current.clientWidth;
		canvasRef.current.height = canvasRef.current.clientHeight;

		drawCanvas({ hue: Hue, saturation: Saturation, value: Value, alpha: Alpha, red: Red, green: Green, blue: Blue });
	}, []);

	React.useEffect(() => {
		if (color && (/^#([0-9A-Fa-f]{6})$/.test(color) || /^#([0-9A-Fa-f]{8})$/.test(color)) && color != Hex) {
			const red = parseInt(color.slice(1, 3), 16);
			const green = parseInt(color.slice(3, 5), 16);
			const blue = parseInt(color.slice(5, 7), 16);
			const alpha = (parseInt(color.slice(7, 9) || 'ff', 16) / 255) * 100;

			const [hue, saturation, value] = rgbToHsv(red, green, blue);

			SetRed(red);

			SetGreen(green);

			SetBlue(blue);

			SetAlpha(alpha);

			SetHue(Math.round(hue));

			SetSaturation(Math.round(saturation));

			SetValue(Math.round(value));

			SetHex(color);

			drawCanvas({ hue, saturation, value, alpha, red, green, blue });
		}
	}, [color]);

	return (
		<div
			style={{ background }}
			className={classNames({ 'color-picker': true })}
		>
			<canvas
				width={300}
				height={300}
				ref={(ref) => (canvasRef.current = ref)}
				onMouseDown={(e) => {
					SetHSDragStared(true);

					updateThroughHS(e);
				}}
				className={classNames({ 'color-picker-sv-canvas': true })}
				onMouseMove={(e) => (HSDragStared ? updateThroughHS(e) : null)}
				onMouseUp={() => {
					SetHSDragStared(false);

					if (HSDragStared) onBlur();
				}}
				onMouseLeave={() => {
					SetHSDragStared(false);

					if (HSDragStared) onBlur();
				}}
			/>
			<div className={classNames({ 'color-picker-controls': true })}>
				<div className={classNames({ 'color-picker-control': true })}>
					<input
						min={'0'}
						max={'360'}
						value={Hue}
						type={'range'}
						onMouseUp={onBlur}
						onChange={updateThroughHue}
						onKeyDown={(e) => e.stopPropagation()}
						className={classNames({ 'color-picker-slider': true, 'hue-slider': true })}
					/>
				</div>
				<div className={classNames({ 'color-picker-control': true })}>
					<input
						min={'0'}
						max={'100'}
						value={Alpha}
						type={'range'}
						onMouseUp={onBlur}
						onChange={updateThroughAlpha}
						onKeyDown={(e) => e.stopPropagation()}
						style={{ '--rgb': `${Red}, ${Green}, ${Blue}` }}
						className={classNames({ 'color-picker-slider': true, 'alpha-slider': true })}
					/>
				</div>
				<div className={classNames({ 'color-picker-control-row': true })}>
					<input
						value={Hex}
						type={'text'}
						onBlur={onBlur}
						placeholder={'#RRGGBBAA'}
						onChange={updateThroughHex}
						onKeyDown={(e) => e.stopPropagation()}
						className={classNames({ 'color-picker-text-input': true })}
					/>
					<div
						onClick={copyHex}
						style={{ background: Hex, color: getContrastColor(Hex, '#53504a') }}
						className={classNames({ 'color-picker-copy-button': true })}
					>
						Copy
					</div>
				</div>
				<div className={classNames({ 'color-picker-control-row': true })}>
					<div className={classNames({ 'color-picker-control-column': true })}>
						<input
							min={'0'}
							max={'255'}
							value={Red}
							type={'number'}
							onBlur={onBlur}
							onKeyDown={(e) => e.stopPropagation()}
							className={classNames({ 'color-picker-text-input': true })}
							onChange={(e) => updateThroughRGBA(e.target.value, Green, Blue, Alpha)}
						/>
						<label className={classNames({ 'color-picker-rgba-text': true })}>R</label>
					</div>
					<div className={classNames({ 'color-picker-control-column': true })}>
						<input
							min={'0'}
							max={'255'}
							value={Green}
							type={'number'}
							onBlur={onBlur}
							onKeyDown={(e) => e.stopPropagation()}
							className={classNames({ 'color-picker-text-input': true })}
							onChange={(e) => updateThroughRGBA(Red, e.target.value, Blue, Alpha)}
						/>
						<label className={classNames({ 'color-picker-rgba-text': true })}>G</label>
					</div>
					<div className={classNames({ 'color-picker-control-column': true })}>
						<input
							min={'0'}
							max={'255'}
							value={Blue}
							type={'number'}
							onBlur={onBlur}
							onKeyDown={(e) => e.stopPropagation()}
							className={classNames({ 'color-picker-text-input': true })}
							onChange={(e) => updateThroughRGBA(Red, Green, e.target.value, Alpha)}
						/>
						<label className={classNames({ 'color-picker-rgba-text': true })}>B</label>
					</div>
					<div className={classNames({ 'color-picker-control-column': true })}>
						<input
							min={'0'}
							max={'100'}
							value={Alpha}
							type={'number'}
							onBlur={onBlur}
							onKeyDown={(e) => e.stopPropagation()}
							className={classNames({ 'color-picker-text-input': true })}
							onChange={(e) => updateThroughRGBA(Red, Green, Blue, e.target.value)}
						/>
						<label className={classNames({ 'color-picker-rgba-text': true })}>A</label>
					</div>
				</div>
			</div>
		</div>
	);
};
