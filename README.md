# react-canvas-workbench

[![NPM](https://badge.fury.io/js/react-canvas-workbench.svg)](http://badge.fury.io/js/react-canvas-workbench) [![Downloads per month](https://img.shields.io/npm/dm/react-canvas-workbench.svg)](https://www.npmjs.org/package/react-canvas-workbench) [![Last update](https://img.shields.io/npm/last-update/react-canvas-workbench.svg)](https://www.npmjs.org/package/react-canvas-workbench)

**react-canvas-workbench** is a library that provides extensive and simple functionality for interacting with canvas out of the box

## Features

- Out of the box, you can work with layers and elements, move, scale, rotate, etc.
- Canvas functionality for drawing has been implemented
- Advanced text manipulation, personal fonts
- Ability to customize ready-made components
- Low-level access to functionality for advanced customization

## TODO:

- [x] More complete readme
- [x] Documentation on usage
- [ ] Unit tests
- [ ] Extended (paid) version
- [ ] ...

## Extended (paid) version - _Coming Soon_

We're hard at work on a premium tier of **react-canvas-workbench** that will give power users everything they've been asking for - and more

### What's planned?

| Benefit | How it helps you |
| --- | --- |
| **Full Source Code Access** | Inspect, fork, and extend the codebase to fit any workflow without waiting on upstream releases |
| **Expanded Feature Set** | • A larger suite of ready-made canvas components<br>• Additional hooks for fine-grained, low-level control<br>• Deep theming plus per-method overrides so you can swap out or augment internal helpers |
| **Priority Updates & Fixes** | Subscribers receive new features, optimizations, and patches first-shipped continuously as soon as they clear CI |
| **Feature Request Pool** | Suggest new capabilities or up-vote existing ideas. We snapshot the pool at regular intervals; items with the most votes jump to the top of the roadmap |

> Stay tuned! Watch the repository to be the first to know when the Extended version launches

> **And you can already support me with a donation, all early sponsors will receive a reward, you can see it [on this page](https://www.donationalerts.com/r/iatnaod)**

## Installation

```bash
$ npm install react-canvas-workbench
# or use yarn
$ yarn add react-canvas-workbench
```

## Quick Start

```js
import { ElementsMenu, EditorCanvas, EditorControls } from 'react-canvas-workbench';

export default () => {
	return (
		<div className={'editor'}>
			<div className={'editor-elements'}>
				<ElementsMenu />
			</div>
			<div className={'editor-content'}>
				<EditorControls />
				<EditorCanvas />
			</div>
		</div>
	);
};
```

> You can also start with our example, a guide on how to use it is provided below

## Example installation guide

1. Copy the contents of the example folder
2. Initialize the project by typing **yarn init -y**
3. Type **yarn install react react-dom react-canvas-workbench** and **yarn add --dev parcel**
4. Replace **../../../src/index** with **react-canvas-workbench** in **pages/Home/index.js**
5. Run the project **yarn parcel index.html**

## Usage

**useTranslation:**

```js
import { useTranslation } from 'react-canvas-workbench';

...

const { t, addResources, changeLanguage } = useTranslation();
```

**useTranslation** is built on top of i18n and provides access to the following elements:

1. t(resource) - equivalent to the i18n function, accepts a path to the desired resource

2. addResources(language, resource) - allows you to add or override a resource if you want to use custom names or add a new language. You can see the current state of the resource in example/locales/en.json

3. changeLanguage(language) - switches the current language, works the same way as the similar function in i18n

---

**useCustomization:**

```js
import { useCustomization } from 'react-canvas-workbench';

...

const { customization, setCustomizationSettings, changeCustomizationSettings, resetCustomizationSettings } = useCustomization();
```

**useCustomization** provides access to the following elements for working with customization of built-in components:

1. customization - the current customization state of all components. The parameters for each component are identical to the parameters found in the component's corresponding customization field

2. setCustomizationSettings({ updater }) - sets customization settings for all components at once. updater can be either a function (with access to the current state) or a plain object. Customizable components: editorControls, elementsMenu, editorCanvas, colorPicker

3. changeCustomizationSettings({ component, updater }) - similar to setCustomizationSettings, but applies settings to a specific component only. Customizable components: editorControls, elementsMenu, editorCanvas, colorPicker

4. resetCustomizationSettings({ component }) - resets customization settings for the specified component. Resettable components: editorControls, elementsMenu, editorCanvas, colorPicker, all

---

**useSettings:**

```js
import { useSettings } from 'react-canvas-workbench';

...

const { settings, changeSettings, resetSettings } = useSettings();
```

**useSettings** provides access to the following elements for managing editor settings:

1. settings - the current state of the editor settings

2. changeSettings(updater) - allows updating editor settings. The updater can be either a function with access to the current state or a plain object

_Available fields to modify:_

```json
{
	"snap": 30,
	"handleSize": 8,
	"rotateHandleSize": 16,
	"showMiddleLines": true,
	"rotatehandleOffset": 30,
	"positionChangeByArrowsShiftMultiplier": 10,
	"positionChangeByArrows": {
		"ArrowUp": { "x": 0, "y": -1 },
		"ArrowRight": { "x": 1, "y": 0 },
		"ArrowDown": { "x": 0, "y": 1 },
		"ArrowLeft": { "x": -1, "y": 0 }
	}
}
```

3. resetSettings() - resets the settings to their default values

---

**useFonts:**

```js
import { useFonts } from 'react-canvas-workbench';

...

const { fonts, setFonts, addDefaultFonts } =  useFonts();
```

**useFonts** provides access to the following elements for managing editor fonts:

1. fonts - the current state of loaded fonts. Fonts can either be preloaded (if previously declared and loaded) or dynamically loaded after being added

2. setFonts(fonts) - sets the list of fonts to be used in the editor. The array should contain objects with the following structure: _{ family: string, url?: string, loaded: boolean }_. The url is required only if loaded is false and the font needs to be loaded before use. For preloaded fonts, simply set loaded: true

3. addDefaultFonts() - adds 10 basic web-safe fonts that are available on all major platforms: Arial, Times New Roman, Courier New, Georgia, Verdana, Trebuchet MS, Tahoma, Palatino, Comic Sans MS, Impact

---

**useContent:**

```js
import { useContent } from 'react-canvas-workbench';

...

const { width, height, elements, selectedElement, selectedElementId, changeWidth, changeHeight,changeElements, deselectElement, selectElementById, changeSelectedElement } =  useContent();
```

**useContent** provides access to the following elements for managing editor content:

1. width - current canvas width

2. height - current canvas height

3. elements - current state of all elements

4. selectedElement - the currently selected element (can be null)

5. selectedElementId - the ID of the selected element (can be null)

6. changeWidth(width) - updates the current canvas width

7. changeHeight(height) - updates the current canvas height

8. changeElements(updater) - updates the current elements state. The updater can be a function (with access to the current state) or a plain object. Available fields to update: elements, selectedElement, selectedElementId

9. selectElementById(elementId) - selects an element from the elements array by its ID

10. deselectElement() - deselects the currently selected element

11. changeSelectedElement(updater) - updates the state of the selected element. The updater can be a function (with access to the current state) or a plain object. Available fields to update: elements, selectedElement, selectedElementId

---

**useHistory:**

```js
import { useHistory } from 'react-canvas-workbench';

...

const { canUndo, canRedo, list, index, current, undo, redo, reset } =  useHistory();
```

**useHistory** provides access to the following elements for managing the history of element changes:

1. canUndo - indicates whether an undo action is currently possible

2. canRedo - indicates whether a redo action is currently possible

3. list - the current history list of element states

4. index - the index of the current state within the history list

5. current - the current state of elements in history

6. undo() - reverts the last change

7. redo() - reapplies the last undone change

8. reset({ elements }) - resets the history state and overrides the initial history snapshot with the provided elements

---

**ColorPicker:**

```js
import { ColorPicker } from 'react-canvas-workbench';

export default () => {
	return (
		<ColorPicker
			color={color}
			copyHexCallback={() => {}}
			onColorChange={(hex) => {}}
		/>
	);
};
```

color – a variable representing the current color

onColorChange – a function for updating the color state

copyHexCallback – a callback function triggered after the color is copied

---

**ElementsMenu:**

```js
import { ElementsMenu } from 'react-canvas-workbench';

export default () => {
	return <ElementsMenu />;
};
```

A ready-to-use component that provides simple access to managing elements and layers

---

**EditorControls:**

```js
import { EditorControls } from 'react-canvas-workbench';

export default () => {
	return <EditorControls />;
};
```

A ready-to-use component that provides simple access to managing the element change history

---

**EditorCanvas:**

```js
import { EditorCanvas } from 'react-canvas-workbench';

export default () => {
	return <EditorCanvas onPreviewChange={(canvasDataUrl) => {}} />;
};
```

A ready-to-use component that provides direct access to the canvas and visual editing of elements

onPreviewChange – a function for updating the preview image

---
