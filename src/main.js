import '@fontsource/noto-sans-khmer/400.css';
import '@fontsource/noto-sans-khmer/500.css';
import '@fontsource/noto-sans-khmer/600.css';
import '@fontsource/noto-sans-khmer/700.css';
import { createApp } from 'vue';
import App from './App.vue';
import { translateText } from './i18n';

const translatedValues = new WeakMap();

function translateValue(target, key, locale) {
	const currentValue = key === 'nodeValue' ? target.nodeValue : target.getAttribute(key);
	const entries = translatedValues.get(target) ?? new Map();
	const previous = entries.get(key);
	const sourceValue = previous && previous.rendered === currentValue ? previous.source : currentValue;
	const rendered = translateText(sourceValue, locale);
	if (rendered !== currentValue) {
		if (key === 'nodeValue') target.nodeValue = rendered;
		else target.setAttribute(key, rendered);
	}
	entries.set(key, { source: sourceValue, rendered });
	translatedValues.set(target, entries);
}

function translateElement(element, locale) {
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
	while (walker.nextNode()) {
		if (!walker.currentNode.parentElement?.closest('[data-no-translate]')) {
			translateValue(walker.currentNode, 'nodeValue', locale);
		}
	}

	const elements = [element, ...element.querySelectorAll('*')];
	for (const child of elements) {
		if (child.closest('[data-no-translate]')) continue;
		for (const attribute of ['aria-label', 'aria-description', 'placeholder', 'title']) {
			if (child.hasAttribute(attribute)) translateValue(child, attribute, locale);
		}
	}
}

const app = createApp(App);
app.directive('translate', {
	mounted(element, binding) {
		translateElement(element, binding.value);
	},
	updated(element, binding) {
		translateElement(element, binding.value);
	},
});
app.mount('#app');