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
import VisibleIcon from '../../Icons/VisibleIcon';

import { changeEditorContentFields } from '../../../store/actions/editor';

export default React.memo(
	({ element, selectElement, deleteElement, duplicateElement, toggleElementLock, toggleElementVisibility }) => {
		const selectedElement = useReduxState((s) => s.editorManager.content.selectedElement);
		const [ShowDeleteAlert, SetShowDeleteAlert] = React.useState(false);
		const dispatch = useReduxDispatch();
		const { t } = useTranslation();

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
					<div className={classNames({ 'elements-menu-list-item-background-wrapper': true })}>
						<div
							style={{ background: selectedElement && selectedElement.id == element.id ? selectedElement.color : element.color }}
							className={classNames({ 'elements-menu-list-item-background': true })}
						/>
					</div>
					<span className={classNames({ 'elements-menu-list-item-name': true })}>
						{t('elements-menu.element-types.background')}
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
					<div className={classNames({ 'elements-menu-list-item-body': true, 'background-element-settings': true })}>
						<span className={classNames({ 'background-element-settings-label': true })}>
							{t('elements-menu.background-element.color-label')}
						</span>
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
