export function triggerClipboardEvent(target: HTMLElement, text: string): ClipboardEvent {
	const event = new ClipboardEvent('paste', {clipboardData: new DataTransfer()}); 
	event.clipboardData.items.add(text, 'text/plain');
	spyOn(event, 'preventDefault');
	target.dispatchEvent(event);
	return event;
}