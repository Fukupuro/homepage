// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import icon from 'astro-icon';

import preact from '@astrojs/preact';

// Backend のドメインを image 最適化の許可リストに追加（Thumbnail.astro 等のリモート画像用）
const backendUrl = process.env.PUBLIC_CMS_URL || '';
const imageDomains = ['localhost', '127.0.0.1'];
try {
	if (backendUrl) {
		const { hostname } = new URL(backendUrl);
		if (hostname && !imageDomains.includes(hostname)) {
			imageDomains.push(hostname);
		}
	}
} catch {
	// PUBLIC_CMS_URL が不正な場合は localhost のみ許可
}

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), icon(), preact({ compat: true })],
	image: {
		domains: imageDomains,
	},
  site: 'https://fukupro.club',
	base: '/',
});
