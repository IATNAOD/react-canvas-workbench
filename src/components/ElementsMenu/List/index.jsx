import './style.sass';

import DraggableList from 'react-draggable-list';
import classNames from 'classnames';
import uuid4 from 'uuid4';
import React from 'react';

import { useReduxState, useReduxDispatch } from '../../../hooks/useRedux';
import useTranslation from '../../../hooks/useTranslation';

import DefaultButton from '../../Buttons/DefaultButton';
import BackgroundElement from '../BackgroundElement';
import CanvasElement from '../CanvasElement';
import FigureElement from '../FigureElement';
import ImageElement from '../ImageElement';
import TextElement from '../TextElement';

import { changeEditorContentField, selectElement } from '../../../store/actions/editor';

export default ({
	customization = {
		backgroundColor: '',
		selectLabelColor: '',
		selectValueColor: '',
		listItemNameColor: '',
		settingsLabelColor: '',
		settingsInputColor: '',
		imageUploadIconColor: '',
		typesBackgroundColor: '',
		selectBackgroundColor: '',
		imageUploadBorderColor: '',
		listItemBackgroundColor: '',
		listItemDeleteAlertColor: '',
		typeButtonBackgroundColor: '',
		listItemControlsIconColor: '',
		selectWithSearchBackground: '',
		selectWithSearchValueColor: '',
		selectWithSearchLabelColor: '',
		imageUploadBackgroundColor: '',
		listItemSelectedBorderColor: '',
		settingsInputBackgroundColor: '',
		openTypesButtonBackgroundColor: '',
		closeTypesButtonBackgroundColor: '',
		selectPickedValueBackgroundColor: '',
		listItemDeleteButtonBackgroundColor: '',
		selectWithSearchSearchInputBorderColor: '',
		selectWithSearchPickedValueBackgroundColor: '',
		selectWithSearchSearchInputBackgroundColor: '',
		colorPicker: { rgbaTextColor: '', inputTextColor: '', backgroundColor: '', inputBackgroundColor: '' },
	},
}) => {
	const selectedElementId = useReduxState((s) => s.editorManager.content.selectedElementId);
	const customizationSettings = useReduxState((s) => s.customizationManager.elementsMenu);
	const [AddElementMenuOpened, SetAddElementMenuOpened] = React.useState(false);
	const canvasHeight = useReduxState((s) => s.editorManager.content.height);
	const elements = useReduxState((s) => s.editorManager.content.elements);
	const canvasWidth = useReduxState((s) => s.editorManager.content.width);
	const ElementsContainer = React.createRef();
	const dispatch = useReduxDispatch();
	const { t } = useTranslation();

	const addElement = ({ type }) => {
		switch (type) {
			case 'text': {
				const fontSize = 40;
				// const scale = width / 1600;

				// ContentCanvasCtxRef.current.font = `${fontSize / scale}px "Arial"`;
				// ContentCanvasCtxRef.current.fillStyle = '#000000';

				// let width = ContentCanvasCtxRef.current.measureText('Text').width * scale;

				dispatch(
					changeEditorContentField({
						name: 'elements',
						updater: [
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

				break;
			}
			case 'image': {
				let width = 150;
				let image = null;
				let height = 150;

				dispatch(
					changeEditorContentField({
						name: 'elements',
						updater: [
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
							},
						],
					})
				);

				break;
			}
			case 'figure': {
				dispatch(
					changeEditorContentField({
						name: 'elements',
						updater: [
							...elements,
							{
								x: 0,
								y: 0,
								rotate: 0,
								width: 150,
								height: 150,
								id: uuid4(),
								locked: false,
								visible: true,
								type: 'figure',
								color: '#ffffff',
								figure: 'rectangle',
							},
						],
					})
				);

				break;
			}
			case 'background': {
				dispatch(
					changeEditorContentField({
						name: 'elements',
						updater: [
							{
								id: uuid4(),
								locked: false,
								visible: true,
								color: '#ffffff',
								type: 'background',
							},
							...elements,
						],
					})
				);

				break;
			}
			case 'canvas': {
				dispatch(
					changeEditorContentField({
						name: 'elements',
						updater: [
							...elements,
							{
								x: 0,
								y: 0,
								rotate: 0,
								paths: [],
								id: uuid4(),
								width: 3200,
								height: 1600,
								locked: false,
								visible: true,
								brushWidth: 20,
								type: 'canvas',
								color: '#000000',
							},
						],
					})
				);

				break;
			}
		}

		SetAddElementMenuOpened(false);
	};

	const updateElementsOrder = (newElements) => {
		dispatch(changeEditorContentField({ name: 'elements', updater: newElements }));
	};

	const selectElementWrapper = (element) => {
		dispatch(selectElement({ element }));
	};

	const duplicateElement = (element) => {
		const elementIndex = elements.findIndex((e) => e.id == element.id);

		dispatch(
			changeEditorContentField({ name: 'elements', updater: elements.toSpliced(elementIndex, 0, { ...element, id: uuid4() }) })
		);
	};

	const toggleElementLock = (elementId) => {
		dispatch(
			changeEditorContentField({
				name: 'elements',
				updater: elements.map((v) => (v.id == elementId ? { ...v, locked: !v.locked } : v)),
			})
		);
	};

	const toggleElementVisibility = (elementId) => {
		dispatch(
			changeEditorContentField({
				name: 'elements',
				updater: elements.map((v) => (v.id == elementId ? { ...v, visible: !v.visible } : v)),
			})
		);
	};

	const deleteElement = (elementId) => {
		dispatch(changeEditorContentField({ name: 'elements', updater: elements.filter((v) => v.id != elementId) }));
	};

	return (
		<div
			className={classNames({ 'elements-menu': true })}
			style={{ backgroundColor: customization.backgroundColor || customizationSettings.backgroundColor }}
		>
			<div className={classNames({ 'elements-menu-header': true })}>
				<div
					className={classNames({ 'elements-menu-types': true, hidden: !AddElementMenuOpened })}
					style={{ backgroundColor: customization.typesBackgroundColor || customizationSettings.typesBackgroundColor }}
				>
					<DefaultButton
						flex={1}
						gap={'10px'}
						height={'36px'}
						text={t('elements-menu.close-add-element-popup')}
						onClick={() => SetAddElementMenuOpened(false)}
						background={customization.closeTypesButtonBackgroundColor || customizationSettings.closeTypesButtonBackgroundColor}
					/>
					<DefaultButton
						flex={1}
						gap={'10px'}
						height={'36px'}
						text={t('elements-menu.element-types.text')}
						onClick={() => addElement({ type: 'text' })}
						background={customization.typeButtonBackgroundColor || customizationSettings.typeButtonBackgroundColor}
					/>
					<DefaultButton
						flex={1}
						gap={'10px'}
						height={'36px'}
						text={t('elements-menu.element-types.image')}
						onClick={() => addElement({ type: 'image' })}
						background={customization.typeButtonBackgroundColor || customizationSettings.typeButtonBackgroundColor}
					/>
					<DefaultButton
						flex={1}
						gap={'10px'}
						height={'36px'}
						text={t('elements-menu.element-types.figure')}
						onClick={() => addElement({ type: 'figure' })}
						background={customization.typeButtonBackgroundColor || customizationSettings.typeButtonBackgroundColor}
					/>
					<DefaultButton
						flex={1}
						gap={'10px'}
						height={'36px'}
						text={t('elements-menu.element-types.background')}
						onClick={() => addElement({ type: 'background' })}
						background={customization.typeButtonBackgroundColor || customizationSettings.typeButtonBackgroundColor}
					/>
					<DefaultButton
						flex={1}
						gap={'10px'}
						height={'36px'}
						text={t('elements-menu.element-types.canvas')}
						onClick={() => addElement({ type: 'canvas' })}
						background={customization.typeButtonBackgroundColor || customizationSettings.typeButtonBackgroundColor}
					/>
				</div>
				<DefaultButton
					gap={'10px'}
					height={'36px'}
					onClick={() => SetAddElementMenuOpened(true)}
					text={t('elements-menu.open-add-element-popup')}
					background={customization.openTypesButtonBackgroundColor || customizationSettings.openTypesButtonBackgroundColor}
				/>
			</div>
			<div className={classNames({ 'elements-menu-content-wrapper': true })}>
				<div className={classNames({ 'elements-menu-content': true })}>
					<div className={classNames({ 'elements-menu-list': true })}>
						<DraggableList
							itemKey={(item) => item.id}
							list={elements.toReversed()}
							container={() => ElementsContainer.current}
							onMoveEnd={(newList) => updateElementsOrder(newList.toReversed())}
							template={React.useCallback(
								({ item: element, dragHandleProps }) => (
									<div
										{...(selectedElementId != element.id && !element.locked ? dragHandleProps : {})}
										className={classNames({ 'elements-menu-list-item': true, picked: selectedElementId == element.id })}
										style={{
											backgroundColor: customization.listItemBackgroundColor || customizationSettings.listItemBackgroundColor,
											borderColor:
												selectedElementId == element.id
													? customization.listItemSelectedBorderColor || customizationSettings.listItemSelectedBorderColor
													: customization.listItemBackgroundColor || customizationSettings.listItemBackgroundColor,
										}}
									>
										{element.type == 'text' ? (
											<TextElement
												element={element}
												customization={customization}
												customizationSettings={customizationSettings}
												deleteElement={deleteElement}
												duplicateElement={duplicateElement}
												selectElement={selectElementWrapper}
												toggleElementLock={toggleElementLock}
												toggleElementVisibility={toggleElementVisibility}
											/>
										) : element.type == 'image' ? (
											<ImageElement
												element={element}
												customization={customization}
												customizationSettings={customizationSettings}
												deleteElement={deleteElement}
												duplicateElement={duplicateElement}
												selectElement={selectElementWrapper}
												toggleElementLock={toggleElementLock}
												toggleElementVisibility={toggleElementVisibility}
											/>
										) : element.type == 'figure' ? (
											<FigureElement
												element={element}
												customization={customization}
												customizationSettings={customizationSettings}
												deleteElement={deleteElement}
												duplicateElement={duplicateElement}
												selectElement={selectElementWrapper}
												toggleElementLock={toggleElementLock}
												toggleElementVisibility={toggleElementVisibility}
											/>
										) : element.type == 'background' ? (
											<BackgroundElement
												element={element}
												customization={customization}
												customizationSettings={customizationSettings}
												deleteElement={deleteElement}
												duplicateElement={duplicateElement}
												selectElement={selectElementWrapper}
												toggleElementLock={toggleElementLock}
												toggleElementVisibility={toggleElementVisibility}
											/>
										) : element.type == 'canvas' ? (
											<CanvasElement
												element={element}
												customization={customization}
												customizationSettings={customizationSettings}
												deleteElement={deleteElement}
												duplicateElement={duplicateElement}
												selectElement={selectElementWrapper}
												toggleElementLock={toggleElementLock}
												toggleElementVisibility={toggleElementVisibility}
											/>
										) : null}
									</div>
								),
								[elements, selectedElementId]
							)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
