// @/services/ooxml2html

function ooxml_to_html(xml: string): string {
	const out: string[] = [];
	for (const [para] of xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)) {
		const style = para.match(/<w:pStyle w:val="([^"]+)"/)?.[1] ?? '';
		let content = '';
		for (const [run] of para.matchAll(/<w:r[ >][\s\S]*?<\/w:r>/g)) {
			const bold = /<w:b[ \/]/.test(run);
			const italic = /<w:i[ \/]/.test(run);
			let t = [...run.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)]
				.map(m => m[1]).join('');
			t = t.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
			if (bold) t = `<b>${t}</b>`;
			if (italic) t = `<i>${t}</i>`;
			content += t
		}
		if (!content.trim()) { out.push('<p></p>'); continue }
		const tag = /^Heading1$/.test(style) ? 'h1'
			: /^Heading2$/.test(style) ? 'h2' : 'p';
		out.push(`<${tag}>${content}</${tag}>`)
	}
	return out.join('')
}