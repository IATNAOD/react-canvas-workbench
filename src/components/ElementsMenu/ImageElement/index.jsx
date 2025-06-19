import './style.sass';

import classNames from 'classnames';
import React from 'react';

import { useReduxDispatch, useReduxState } from '../../../hooks/useRedux';
import useTranslation from '../../../hooks/useTranslation';

import LongPressButton from '../../Buttons/LongPressButton';
import DefaultInput from '../../Inputs/DefaultInput';

import PadlockUnlockedIcon from '../../Icons/PadlockUnlockedIcon';
import PadlockLockedIcon from '../../Icons/PadlockLockedIcon';
import ImageElementIcon from '../../Icons/ImageElementIcon';
import UploadImageIcon from '../../Icons/UploadImageIcon';
import NotVisibleIcon from '../../Icons/NotVisibleIcon';
import DuplicateIcon from '../../Icons/DuplicateIcon';
import VisibleIcon from '../../Icons/VisibleIcon';

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
		const FileInputRef = React.useRef();
		const dispatch = useReduxDispatch();
		const { t } = useTranslation();

		const openLoadImagePopup = () => {
			FileInputRef.current.click();
		};

		const loadFile = async (files) => {
			if (!files.length || (files.length && !files[0].type.includes('image'))) return;

			const reader = new FileReader();

			reader.onload = (e) => {
				let image = new Image();

				image.onload = () => {
					updateElements({ image });
				};

				image.src = e.target.result;
			};

			reader.readAsDataURL(files[0]);
		};

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
					<div
						className={classNames({
							'elements-menu-list-item-image-wrapper': true,
							real: (selectedElement && selectedElement.id == element.id && selectedElement.image) || element.image,
						})}
					>
						{(selectedElement && selectedElement.id == element.id && selectedElement.image) || element.image ? (
							<img
								className={classNames({ 'elements-menu-list-item-image': true })}
								src={
									selectedElement && selectedElement.id == element.id && selectedElement.image
										? selectedElement.image.src
										: element.image.src
								}
							/>
						) : (
							<ImageElementIcon
								width={30}
								height={30}
								fill={customization.listItemControlsIconColor || customizationSettings.listItemControlsIconColor}
							/>
						)}
					</div>
					<span className={classNames({ 'elements-menu-list-item-name': true })}>{t('elements-menu.element-types.image')}</span>
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
						className={classNames({ 'elements-menu-list-item-icon': true, 'no-drag': true })}
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
					<div className={classNames({ 'elements-menu-list-item-body': true, 'image-element-settings': true })}>
						<div
							onClick={openLoadImagePopup}
							className={classNames({ 'image-element-settings-upload-wrapper': true })}
							style={{
								borderColor: customization.imageUploadBorderColor || customizationSettings.imageUploadBorderColor,
								backgroundColor: customization.imageUploadBackgroundColor || customizationSettings.imageUploadBackgroundColor,
							}}
						>
							<input
								type={'file'}
								accept={'image/*'}
								ref={(ref) => (FileInputRef.current = ref)}
								onChange={(event) => loadFile(event.target.files)}
							/>
							{selectedElement.image ? (
								<img
									src={selectedElement.image.src}
									className={classNames({ 'image-element-settings-upload-image': true })}
								/>
							) : (
								<UploadImageIcon
									width={50}
									height={50}
									fill={customization.imageUploadIconColor || customizationSettings.imageUploadIconColor}
								/>
							)}
						</div>
						<div className={classNames({ 'image-element-settings-row': true })}>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.x) || 0}
								label={t('elements-menu.image-element.x-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ x: parseInt(e.target.value) || 0 }))}
								labelColor={customization.settingsLabelColor || customizationSettings.settingsLabelColor}
								inputColor={customization.settingsInputColor || customizationSettings.settingsInputColor}
								inputBackground={customization.settingsInputBackgroundColor || customizationSettings.settingsInputBackgroundColor}
							/>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.y) || 0}
								label={t('elements-menu.image-element.y-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ y: parseInt(e.target.value) || 0 }))}
								labelColor={customization.settingsLabelColor || customizationSettings.settingsLabelColor}
								inputColor={customization.settingsInputColor || customizationSettings.settingsInputColor}
								inputBackground={customization.settingsInputBackgroundColor || customizationSettings.settingsInputBackgroundColor}
							/>
						</div>
						<div className={classNames({ 'image-element-settings-row': true })}>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.width) || 0}
								label={t('elements-menu.image-element.width-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								labelColor={customization.settingsLabelColor || customizationSettings.settingsLabelColor}
								inputColor={customization.settingsInputColor || customizationSettings.settingsInputColor}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ width: parseInt(e.target.value) || 0 }))}
								inputBackground={customization.settingsInputBackgroundColor || customizationSettings.settingsInputBackgroundColor}
							/>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.height) || 0}
								label={t('elements-menu.image-element.height-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								labelColor={customization.settingsLabelColor || customizationSettings.settingsLabelColor}
								inputColor={customization.settingsInputColor || customizationSettings.settingsInputColor}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ height: parseInt(e.target.value) || 0 }))}
								inputBackground={customization.settingsInputBackgroundColor || customizationSettings.settingsInputBackgroundColor}
							/>
						</div>
						<div className={classNames({ 'image-element-settings-row': true })}>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.rotate) || 0}
								label={t('elements-menu.image-element.rotate-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								labelColor={customization.settingsLabelColor || customizationSettings.settingsLabelColor}
								inputColor={customization.settingsInputColor || customizationSettings.settingsInputColor}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ rotate: parseInt(e.target.value) || 0 }))}
								inputBackground={customization.settingsInputBackgroundColor || customizationSettings.settingsInputBackgroundColor}
							/>
						</div>
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
