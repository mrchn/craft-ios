// @/craft/ooxml2html

export function ooxml_to_html (xml: string): string {
	const out: string[] = []
	const matches = xml.matchAll(
		/(<w:tbl[ >][\s\S]*?<\/w:tbl>)|(<w:p[ >][\s\S]*?<\/w:p>)/g
	)
	let inList = false

	for (const [, tbl, para] of matches) {
		if (tbl) {
			if (inList) { out.push('</ul>') ; inList = false }
			let rows = ''
			for (const [row] of tbl.matchAll(/<w:tr[ >][\s\S]*?<\/w:tr>/g)) {
				let cells = ''
				for (const [cell] of row.matchAll(/<w:tc[ >][\s\S]*?<\/w:tc>/g)) {
					const text = [...cell.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)]
						.map(m => m[1]).join('')
					cells += `<td style="border:1px solid #999;padding:6px">${text}</td>`
				}
				rows += `<tr>${cells}</tr>`
			}
			out.push(`<table style="border-collapse:collapse;width:100%;margin-bottom:12px">${rows}</table>`)
		}
		else if (para) {
			const pPr = para.match(/<w:pPr[ >][\s\S]*?<\/w:pPr>/)?.[0] ?? ''
			const isList = /<w:numPr/.test(pPr)
			if (isList && !inList) {
				out.push('<ul style="margin-top:0;margin-bottom:12px;padding-left:20px">')
				inList = true
			} else if (!isList && inList) {
				out.push('</ul>') ; inList = false
			}
			const style = pPr.match(/<w:pStyle w:val="([^"]+)"/)?.[1] ?? ''
			const jc = pPr.match(/<w:jc w:val="([^"]+)"/)?.[1] ?? ''
			const indLeft = pPr.match(/<w:ind[^>]*w:left="(\d+)"/)?.[1]

			let textAlign = ''
			if (jc === 'center') textAlign = 'center'
			else if (jc === 'right') textAlign = 'right'
			else if (jc === 'both') textAlign = 'justify'

			let content = ''
			for (const [run] of para.matchAll(/<w:r[ >][\s\S]*?<\/w:r>/g)) {
				const bold = /<w:b[ \/]/.test(run)
				const italic = /<w:i[ \/]/.test(run)
				let t = [...run.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)]
					.map(m => m[1]).join('')
				t = t.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
				if (bold) t = `<b>${t}</b>`
				if (italic) t = `<i>${t}</i>`
				content += t
			}
			if (!content.trim()) { out.push('<p></p>') ; continue }

			const tag = isList ? 'li'
				: /^Heading1$/.test(style) ? 'h1'
				: /^Heading2$/.test(style) ? 'h2' : 'p'

			const cssStyles = []
			if (textAlign) cssStyles.push(`text-align:${textAlign}`)

			if (isList) {
				const ilvl = pPr.match(/<w:ilvl w:val="(\d+)"/)?.[1]
				if (ilvl && ilvl !== '0') {
					cssStyles.push(`margin-left:${parseInt(ilvl, 10) * 20}px`)
				}
			} else if (indLeft) {
				const px = Math.round(parseInt(indLeft, 10) / 15)
				if (px > 0) cssStyles.push(`margin-left:${px}px`)
			}


			const styleAttr = cssStyles.length
				? ` style="${cssStyles.join(';')}"` : ''
			out.push(`<${tag}${styleAttr}>${content}</${tag}>`)
		}
	} if (inList) out.push('</ul>') ; return out.join('')
}