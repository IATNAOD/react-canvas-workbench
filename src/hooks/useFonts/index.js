import { useReduxDispatch, useReduxState } from '../useRedux';

import { changeEditorContentField } from '../../store/actions/editor';

import { default_fonts } from '../../config';

export default () => {
	const fonts = useReduxState((s) => s.editorManager.content.fonts);
	const dispatch = useReduxDispatch();

	const setFonts = (fonts = []) =>
		dispatch(
			changeEditorContentField({
				name: 'fonts',
				updater: fonts.filter((font) => font && font.family && (font.loaded || font.url)),
			})
		);

	const addDefaultFonts = () =>
		dispatch(
			changeEditorContentField({
				name: 'fonts',
				updater: ({ fonts }) => [...fonts, ...default_fonts.map((font) => ({ family: font, loaded: true }))],
			})
		);

	return {
		fonts,
		setFonts,
		addDefaultFonts,
	};
};
