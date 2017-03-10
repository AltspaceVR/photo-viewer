export function param(p) {
	return new RegExp(p).test(location.search);
}

export function qs(s) {
	return document.querySelector(s);
}

export function getImageUrl (photo) {
	return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_h.jpg`;
}
