export function triggerKeyDown(target: HTMLElement, key: number, ctrlKey?: boolean): KeyboardEvent {
	const keydownEvent = document.createEvent('KeyboardEvent');
	keydownEvent.initEvent('keydown');
	spyOn(keydownEvent, 'preventDefault');
	spyOnProperty(keydownEvent, 'which').and.returnValue(key);
	spyOnProperty(keydownEvent, 'keyCode').and.returnValue(key);
	spyOnProperty(keydownEvent, 'ctrlKey').and.returnValue(ctrlKey);
	target.dispatchEvent(keydownEvent);
	return keydownEvent;
}