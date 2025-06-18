import './style.sass';

import classNames from 'classnames';
import React from 'react';

import { useReduxDispatch, useReduxState } from '../../../hooks/useRedux';
import useTranslation from '../../../hooks/useTranslation';

import ColorPicker from '../../ColorPicker';

import PadlockUnlockedIcon from '../../Icons/PadlockUnlockedIcon';
import PadlockLockedIcon from '../../Icons/PadlockLockedIcon';
import LongPressButton from '../../Buttons/LongPressButton';
import NotVisibleIcon from '../../Icons/NotVisibleIcon';
import DuplicateIcon from '../../Icons/DuplicateIcon';
import DefaultInput from '../../Inputs/DefaultInput';
import VisibleIcon from '../../Icons/VisibleIcon';
import CanvasIcon from '../../Icons/CanvasIcon';

import { changeEditorContentField, changeEditorContentFields } from '../../../store/actions/editor';

export default React.memo(
	({
		element,
		customization,
		customizationSettings,
		selectElement,
		deleteElement,
		duplicateElement,
		toggleElementLock,
		toggleElementVisibility,
	}) => {
		const selectedElement = useReduxState((s) => s.editorManager.content.selectedElement);
		const [ShowDeleteAlert, SetShowDeleteAlert] = React.useState(false);
		const dispatch = useReduxDispatch();
		const { t } = useTranslation();

		const updateElement = (update = {}) => {
			if (selectedElement && selectedElement.id == element.id)
				dispatch(changeEditorContentField({ name: 'selectedElement', updater: { ...selectedElement, ...update } }));
		};

		const updateElements = (update = {}) => {
			dispatch(
				changeEditorContentFields({
					updater: ({ elements, selectedElement }) => ({
						selectedElement: { ...selectedElement, ...update },
						elements: elements.map((e) => (e.id == selectedElement.id ? { ...selectedElement, ...update } : e)),
					}),
				})
			);
		};

		return (
			<>
				<div
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();

						selectElement(element);
					}}
					className={classNames({ 'elements-menu-list-item-header': true })}
				>
					<div className={classNames({ 'elements-menu-list-item-canvas-wrapper': true })}>
						<CanvasIcon
							width={30}
							height={30}
							fill={customization.listItemControlsIconColor || customizationSettings.listItemControlsIconColor}
						/>
					</div>
					<span className={classNames({ 'elements-menu-list-item-name': true })}>{t('elements-menu.element-types.canvas')}</span>
					<div
						onMouseDown={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						onTouchStart={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();

							duplicateElement(element);
						}}
						className={classNames({ 'elements-menu-list-item-icon': true })}
					>
						<DuplicateIcon
							width={28}
							height={28}
							fill={customization.listItemControlsIconColor || customizationSettings.listItemControlsIconColor}
						/>
					</div>
					<div
						onMouseDown={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						onTouchStart={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();

							toggleElementLock(element.id);
						}}
						className={classNames({ 'elements-menu-list-item-icon': true })}
					>
						{element.locked ? (
							<PadlockLockedIcon
								width={28}
								height={28}
								fill={customization.listItemControlsIconColor || customizationSettings.listItemControlsIconColor}
							/>
						) : (
							<PadlockUnlockedIcon
								width={28}
								height={28}
								fill={customization.listItemControlsIconColor || customizationSettings.listItemControlsIconColor}
							/>
						)}
					</div>
					<div
						onMouseDown={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						onTouchStart={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();

							toggleElementVisibility(element.id);
						}}
						className={classNames({ 'elements-menu-list-item-icon': true })}
					>
						{element.visible ? (
							<VisibleIcon
								width={28}
								height={28}
								fill={customization.listItemControlsIconColor || customizationSettings.listItemControlsIconColor}
							/>
						) : (
							<NotVisibleIcon
								width={28}
								height={28}
								fill={customization.listItemControlsIconColor || customizationSettings.listItemControlsIconColor}
							/>
						)}
					</div>
				</div>
				{selectedElement ? (
					<div className={classNames({ 'elements-menu-list-item-body': true, 'canvas-element-settings': true })}>
						<div className={classNames({ 'canvas-element-settings-row': true })}>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								inpytType={'number'}
								value={parseInt(selectedElement.brushWidth) || 0}
								label={t('elements-menu.canvas-element.brush-width-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								labelColor={customization.settingsLabelColor || customizationSettings.settingsLabelColor}
								inputColor={customization.settingsInputColor || customizationSettings.settingsInputColor}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ brushWidth: parseInt(e.target.value) || 0 }))}
								inputBackground={customization.settingsInputBackgroundColor || customizationSettings.settingsInputBackgroundColor}
							/>
						</div>
						<span
							style={{ color: customization.settingsLabelColor || customizationSettings.settingsLabelColor }}
							className={classNames({ 'canvas-element-settings-label': true })}
						>
							{t('elements-menu.canvas-element.brush-color-label')}
						</span>
						<ColorPicker
							color={selectedElement.color}
							customization={customization.colorPicker}
							onColorChange={(color) => (selectedElement.locked ? null : updateElements({ color }))}
						/>
						{selectedElement.locked ? null : (
							<LongPressButton
								gap={'10px'}
								height={'36px'}
								text={t('elements-menu.delete-element')}
								onClick={() => SetShowDeleteAlert(true)}
								onStart={() => SetShowDeleteAlert(false)}
								onLongPress={() => deleteElement(element.id)}
								background={
									customization.listItemDeleteButtonBackgroundColor || customizationSettings.listItemDeleteButtonBackgroundColor
								}
							/>
						)}
						{ShowDeleteAlert ? (
							<span
								className={classNames({ 'elements-menu-list-item-delete-alert': true })}
								style={{ color: customization.listItemDeleteAlertColor || customizationSettings.listItemDeleteAlertColor }}
							>
								{t('elements-menu.alerts.hold-for-delete')}
							</span>
						) : null}
					</div>
				) : null}
			</>
		);
	}
);
