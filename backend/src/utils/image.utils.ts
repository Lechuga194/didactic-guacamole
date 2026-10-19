/** Lee ancho y alto de un PNG o JPEG desde su cabecera, sin dependencias. */
export const imageSize = (buf: Buffer): { width: number; height: number } | null => {
	if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
		return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
	}
	if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
		let offset = 2;
		while (offset + 9 < buf.length) {
			if (buf[offset] !== 0xff) {
				offset++;
				continue;
			}
			const marker = buf[offset + 1];
			const length = buf.readUInt16BE(offset + 2);
			if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
				return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
			}
			offset += 2 + length;
		}
	}
	return null;
};

export default { imageSize };
