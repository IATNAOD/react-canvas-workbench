import './style.sass';

import DraggableList from 'react-draggable-list';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import uuid4 from 'uuid4';
import React from 'react';

import { useReduxState, useReduxDispatch } from '../../hooks/useRedux';

import PadlockUnlockedIcon from '../Icons/PadlockUnlockedIcon';
import PadlockLockedIcon from '../Icons/PadlockLockedIcon';
import NotVisibleIcon from '../Icons/NotVisibleIcon';
import DefaultButton from '../Buttons/DefaultButton';
import DuplicateIcon from '../Icons/DuplicateIcon';
import TrashCanIcon from '../Icons/TrashCanIcon';
import VisibleIcon from '../Icons/VisibleIcon';

import ImageElementImage from 'url:../../assets/images/image-element.png';
import TextElementImage from 'url:../../assets/images/text-element.png';

import { changeEditorField } from '../../store/actions/editor';

export default ({} = {}) => {
	const [AddElementMenuOpened, SetAddElementMenuOpened] = React.useState(false);
	const selectedElement = useReduxState((s) => s.editorManager.selectedElement);
	const elements = useReduxState((s) => s.editorManager.elements);
	const ElementsContainer = React.createRef();
	const dispatch = useReduxDispatch();
	const { t } = useTranslation();

	const addElementWrapper = (action) => {
		action();

		SetAddElementMenuOpened(false);
	};

	const addTextOnSpread = () => {
		const fontSize = 40;
		// const scale = width / 1600;

		// ContentCanvasCtxRef.current.font = `${fontSize / scale}px "Arial"`;
		// ContentCanvasCtxRef.current.fillStyle = '#000000';

		// let width = ContentCanvasCtxRef.current.measureText('Text').width * scale;

		dispatch(
			changeEditorField({
				name: 'elements',
				value: [
					...elements,
					{
						x: 0,
						y: 0,
						width: 100,
						rotate: 0,
						id: uuid4(),
						type: 'text',
						locked: false,
						visible: true,
						justify: false,
						align: 'center',
						editable: false,
						content: 'Text',
						height: fontSize,
						color: '#000000ff',
						fontSize: fontSize,
						fontFamily: 'Arial',
						lineHeight: fontSize,
					},
				],
			})
		);
	};

	const addImageOnSpread = () => {
		let width = 150;
		let image = null;
		let height = 150;

		dispatch(
			changeEditorField({
				name: 'elements',
				value: [
					...elements,
					{
						x: 0,
						y: 0,
						width,
						image,
						height,
						rotate: 0,
						id: uuid4(),
						type: 'image',
						locked: false,
						visible: true,
						pickable: false,
					},
				],
			})
		);
	};

	const updateElementsOrder = (newElements) => {
		dispatch(changeEditorField({ name: 'elements', value: newElements }));
	};

	const selectElement = (element) => {
		dispatch(changeEditorField({ name: 'selectedElement', value: element }));
	};

	const duplicateElement = (element) => {
		const elementIndex = elements.findIndex((e) => e.id == element.id);

		dispatch(changeEditorField({ name: 'elements', value: elements.toSpliced(elementIndex, 0, { ...element, id: uuid4() }) }));
	};

	const toggleElementLock = (elementId) => {
		dispatch(
			changeEditorField({ name: 'elements', value: elements.map((v) => (v.id == elementId ? { ...v, locked: !v.locked } : v)) })
		);
	};

	const toggleElementVisibility = (elementId) => {
		dispatch(
			changeEditorField({ name: 'elements', value: elements.map((v) => (v.id == elementId ? { ...v, visible: !v.visible } : v)) })
		);
	};

	const openConfirmDeleteElementModal = () => {};

	return (
		<div className={classNames({ 'elements-menu': true })}>
			<div className={classNames({ 'elements-menu-header': true })}>
				{AddElementMenuOpened ? (
					<>
						<DefaultButton
							flex={1}
							gap={'10px'}
							text={t('elements-menu.add-image')}
							type={'info'}
							height={'36px'}
							onClick={() => addElementWrapper(addImageOnSpread)}
						/>
						<DefaultButton
							flex={1}
							gap={'10px'}
							text={t('elements-menu.add-text')}
							type={'info'}
							height={'36px'}
							onClick={() => addElementWrapper(addTextOnSpread)}
						/>
					</>
				) : (
					<DefaultButton
						gap={'10px'}
						height={'36px'}
						text={t('elements-menu.add-element')}
						onClick={() => SetAddElementMenuOpened(true)}
					/>
				)}
			</div>
			<div className={classNames({ 'elements-menu-content-wrapper': true })}>
				<div className={classNames({ 'elements-menu-content': true })}>
					<div className={classNames({ 'elements-menu-list': true })}>
						<DraggableList
							itemKey={'id'}
							list={elements.toReversed()}
							template={({ item: element, dragHandleProps }) => (
								<div
									{...dragHandleProps}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();

										selectElement(element);
									}}
									className={classNames({
										'elements-menu-list-item': true,
										picked: selectedElement && selectedElement.id == element.id,
									})}
								>
									<div className={classNames({ 'elements-menu-list-item-image-wrapper': true })}>
										<img
											src={
												element.type == 'image' && element.image && element.image.src
													? element.image.src
													: element.type == 'text'
														? TextElementImage
														: ImageElementImage
											}
											className={classNames({ 'elements-menu-list-item-image': true })}
										/>
									</div>
									<span className={classNames({ 'elements-menu-list-item-name': true })}>
										{element.type == 'text' ? element.content : ''}
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

											openConfirmDeleteElementModal(element.id);
										}}
										className={classNames({ 'elements-menu-list-item-icon': true })}
									>
										<TrashCanIcon
											width={28}
											height={28}
											fill={'#27272A'}
										/>
									</div>
								</div>
							)}
							onMoveEnd={(newList) => updateElementsOrder(newList.toReversed())}
							container={() => ElementsContainer.current}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
