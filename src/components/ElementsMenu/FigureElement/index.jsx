import './style.sass';

import classNames from 'classnames';
import React from 'react';

import { useReduxDispatch, useReduxState } from '../../../hooks/useRedux';
import useTranslation from '../../../hooks/useTranslation';

import LongPressButton from '../../Buttons/LongPressButton';
import DefaultSelect from '../../Selects/DefaultSelect';
import DefaultInput from '../../Inputs/DefaultInput';
import ColorPicker from '../../ColorPicker';

import PadlockUnlockedIcon from '../../Icons/PadlockUnlockedIcon';
import PadlockLockedIcon from '../../Icons/PadlockLockedIcon';
import NotVisibleIcon from '../../Icons/NotVisibleIcon';
import DuplicateIcon from '../../Icons/DuplicateIcon';
import VisibleIcon from '../../Icons/VisibleIcon';

import { changeEditorContentField, changeEditorContentFields } from '../../../store/actions/editor';

export default React.memo(
	({ element, selectElement, deleteElement, duplicateElement, toggleElementLock, toggleElementVisibility }) => {
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
					<div className={classNames({ 'elements-menu-list-item-figure-wrapper': true })}>
						<div
							style={{ background: selectedElement && selectedElement.id == element.id ? selectedElement.color : element.color }}
							className={classNames({
								'elements-menu-list-item-figure': true,
								circle: (selectedElement && selectedElement.id == element.id ? selectedElement : element).figure == 'circle',
								rectangle:
									(selectedElement && selectedElement.id == element.id ? selectedElement : element).figure == 'rectangle',
							})}
						/>
					</div>
					<span className={classNames({ 'elements-menu-list-item-name': true })}>{t('elements-menu.element-types.figure')}</span>
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
					<div className={classNames({ 'elements-menu-list-item-body': true, 'figure-element-settings': true })}>
						<div className={classNames({ 'figure-element-settings-row': true })}>
							<DefaultSelect
								label={t('elements-menu.figure-element.type-label')}
								onChange={(option) => (selectedElement.locked ? null : updateElements({ figure: option.value }))}
								selected={{
									name: t(`elements-menu.figure-element.type-options.${selectedElement.figure}`),
									value: selectedElement.figure,
								}}
								options={[
									{ name: t('elements-menu.figure-element.type-options.circle'), value: 'circle' },
									{ name: t('elements-menu.figure-element.type-options.rectangle'), value: 'rectangle' },
								]}
							/>
						</div>
						<div className={classNames({ 'figure-element-settings-row': true })}>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.x) || 0}
								label={t('elements-menu.figure-element.x-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ x: parseInt(e.target.value) || 0 }))}
							/>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.y) || 0}
								label={t('elements-menu.figure-element.y-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ y: parseInt(e.target.value) || 0 }))}
							/>
						</div>
						{}
						<div className={classNames({ 'figure-element-settings-row': true })}>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.width) || 0}
								label={t('elements-menu.figure-element.width-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) =>
									selectedElement.locked
										? null
										: updateElement({
												width: parseInt(e.target.value) || 0,
												...(selectedElement.figure == 'circle' ? { height: parseInt(e.target.value) || 0 } : {}),
											})
								}
							/>
							{selectedElement.figure != 'circle' ? (
								<DefaultInput
									inputHeight={17}
									placeholder={'12px'}
									value={parseInt(selectedElement.height) || 0}
									label={t('elements-menu.figure-element.height-label')}
									onBlur={() => (selectedElement.locked ? null : updateElements())}
									onEnter={() => (selectedElement.locked ? null : updateElements())}
									onChange={(e) => (selectedElement.locked ? null : updateElement({ height: parseInt(e.target.value) || 0 }))}
								/>
							) : null}
						</div>
						<div className={classNames({ 'figure-element-settings-row': true })}>
							<DefaultInput
								inputHeight={17}
								placeholder={'12px'}
								value={parseInt(selectedElement.rotate) || 0}
								label={t('elements-menu.figure-element.rotate-label')}
								onBlur={() => (selectedElement.locked ? null : updateElements())}
								onEnter={() => (selectedElement.locked ? null : updateElements())}
								onChange={(e) => (selectedElement.locked ? null : updateElement({ rotate: parseInt(e.target.value) || 0 }))}
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
