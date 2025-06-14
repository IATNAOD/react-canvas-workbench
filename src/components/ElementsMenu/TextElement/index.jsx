import './style.sass';

import classNames from 'classnames';
import React from 'react';

import { useReduxDispatch, useReduxState } from '../../../hooks/useRedux';
import useTranslation from '../../../hooks/useTranslation';

import SelectWithSearch from '../../Selects/SelectWithSearch';
import LongPressButton from '../../Buttons/LongPressButton';
import DefaultSelect from '../../Selects/DefaultSelect';
import DefaultInput from '../../Inputs/DefaultInput';
import ColorPicker from '../../ColorPicker';

import PadlockUnlockedIcon from '../../Icons/PadlockUnlockedIcon';
import PadlockLockedIcon from '../../Icons/PadlockLockedIcon';
import NotVisibleIcon from '../../Icons/NotVisibleIcon';
import DuplicateIcon from '../../Icons/DuplicateIcon';
import VisibleIcon from '../../Icons/VisibleIcon';

import TextElementImage from 'url:../../../assets/images/text-element.png';

import { changeEditorContentField, changeEditorContentFields } from '../../../store/actions/editor';

export default React.memo(
	({ element, fonts = [], selectElement, deleteElement, duplicateElement, toggleElementLock, toggleElementVisibility }) => {
		const selectedElement = useReduxState((s) => s.editorManager.content.selectedElement);
		const [ShowDeleteAlert, SetShowDeleteAlert] = React.useState(false);
		const dispatch = useReduxDispatch();
		const { t } = useTranslation();

		const updateElement = (update = {}) => {
			if (selectedElement && selectedElement.id == element.id)
				dispatch(changeEditorContentField({ name: 'selectedElement', value: { ...selectedElement, ...update } }));
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
					<div className={classNames({ 'elements-menu-list-item-image-wrapper': true })}>
						<img
							src={TextElementImage}
							className={classNames({ 'elements-menu-list-item-image': true })}
						/>
					</div>
					<span className={classNames({ 'elements-menu-list-item-name': true })}>
						{selectedElement && selectedElement.id == element.id ? selectedElement.content : element.content}
					</span>
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
							fill={'#27272A'}
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
								fill={'#27272A'}
							/>
						) : (
							<PadlockUnlockedIcon
								width={28}
								height={28}
								fill={'#27272A'}
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
								fill={'#27272A'}
							/>
						) : (
							<NotVisibleIcon
								width={28}
								height={28}
								fill={'#27272A'}
							/>
						)}
					</div>
				</div>
				{selectedElement ? (
					<div className={classNames({ 'elements-menu-list-item-body': true, 'text-element-settings': true })}>
						<span className={classNames({ 'text-element-settings-label': true })}>
							{t('elements-menu.text-element.content-label')}
						</span>
						<div className={classNames({ 'text-element-settings-textarea-wrapper': true })}>
							<textarea
								value={selectedElement.content}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								className={classNames({ 'text-element-settings-textarea': true })}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ content: e.target.value }))}
							/>
						</div>
						<div className={classNames({ 'text-element-settings-row': true })}>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.x) || 0}
								label={t('elements-menu.text-element.x-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ x: parseInt(e.target.value) || 0 }))}
							/>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.y) || 0}
								label={t('elements-menu.text-element.y-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ y: parseInt(e.target.value) || 0 }))}
							/>
						</div>
						<div className={classNames({ 'text-element-settings-row': true })}>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.width) || 0}
								label={t('elements-menu.text-element.width-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ width: parseInt(e.target.value) || 0 }))}
							/>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.lineHeight) || 0}
								label={t('elements-menu.text-element.line-height-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ lineHeight: parseInt(e.target.value) || 0 }))}
							/>
						</div>
						<div className={classNames({ 'text-element-settings-row': true })}>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.fontSize) || 0}
								label={t('elements-menu.text-element.font-size-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) =>
									selectedElement.locked
										? null
										: updateElement({
												fontSize: parseInt(e.target.value) || 0,
												lineHeight: parseInt(e.target.value) || 0,
											})
								}
							/>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.rotate) || 0}
								label={t('elements-menu.text-element.rotate-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ rotate: parseInt(e.target.value) || 0 }))}
							/>
						</div>
						<SelectWithSearch
							label={t('elements-menu.text-element.font-family-label')}
							options={fonts.map((v) => ({ name: v.family, value: v.family }))}
							placeholder={t('elements-menu.text-element.font-family-placeholder')}
							selected={{ name: selectedElement.fontFamily, value: selectedElement.fontFamily }}
							onChange={(option) => (selectedElement.locked ? null : updateElements({ fontFamily: option.value }))}
						/>
						<div className={classNames({ 'text-element-settings-align-justify': true })}>
							<DefaultSelect
								label={t('elements-menu.text-element.align-label')}
								onChange={(option) => (selectedElement.locked ? null : updateElements({ align: option.value }))}
								selected={{
									name: t(`elements-menu.text-element.align-options.${selectedElement.align}`),
									value: selectedElement.align,
								}}
								options={[
									{ name: t('elements-menu.text-element.align-options.left'), value: 'left' },
									{ name: t('elements-menu.text-element.align-options.center'), value: 'center' },
									{ name: t('elements-menu.text-element.align-options.right'), value: 'right' },
								]}
							/>
							<DefaultSelect
								label={t('elements-menu.text-element.justify-label')}
								onChange={(option) => (selectedElement.locked ? null : updateElements({ justify: option.value }))}
								selected={{
									name: t(`elements-menu.text-element.option-${selectedElement.justify ? 'yes' : 'no'}`),
									value: selectedElement.justify,
								}}
								options={[
									{ name: t('elements-menu.text-element.option-yes'), value: true },
									{ name: t('elements-menu.text-element.option-no'), value: false },
								]}
							/>
						</div>
						<ColorPicker
							color={selectedElement.color}
							onColorChange={(color) => (selectedElement.locked ? null : updateElements({ color }))}
						/>
						{selectedElement.locked ? null : (
							<LongPressButton
								gap={'10px'}
								height={'36px'}
								type={'danger'}
								text={t('elements-menu.delete-element')}
								onClick={() => SetShowDeleteAlert(true)}
								onStart={() => SetShowDeleteAlert(false)}
								onLongPress={() => deleteElement(element.id)}
							/>
						)}
						{ShowDeleteAlert ? (
							<span className={classNames({ 'elements-menu-list-item-delete-alert': true })}>
								{t('elements-menu.alerts.hold-for-delete')}
							</span>
						) : null}
					</div>
				) : null}
			</>
		);
	}
);
