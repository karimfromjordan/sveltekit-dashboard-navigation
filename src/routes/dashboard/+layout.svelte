<script>
	import '$lib/global.css';
	import { page } from '$app/stores';

	/** @type {import('./$types').LayoutData}*/
	export let data;

	function js(node) {
		node.classList.replace('no-js', 'js');
	}

	function navigation(nav_elem, { toggle_selector } = {}) {
		const page_elem = nav_elem.nextElementSibling;

		const media_query = window.matchMedia('(max-width: 800px)');

		const button_elem = toggle_selector && document.querySelector(toggle_selector);

		window.x ??= {};

		window.x.navigation = {
			show() {
				page_elem.setAttribute('inert', '');

				nav_elem.removeAttribute('inert');
				nav_elem.classList.add('--overlay');
				nav_elem.querySelector('a[aria-current="true"]')?.focus();

				button_elem.setAttribute('aria-expanded', 'true');
			},
			hide() {
				page_elem.removeAttribute('inert');

				nav_elem.setAttribute('inert', '');
				nav_elem.classList.remove('--overlay');

				button_elem.setAttribute('aria-expanded', 'false');
			},
			stick() {
				page_elem.removeAttribute('inert');
				nav_elem.removeAttribute('inert');
				nav_elem.classList.remove('--overlay');
			}
		};

		function handle_click(e) {
			if (!nav_elem.classList.contains('--overlay')) return;

			const is_link_click = nav_elem.contains(e.target) && e.target.closest('a');
			const is_click_outside = e.target.contains(nav_elem) && e.target !== nav_elem;

			if (is_link_click || is_click_outside) {
				window.x.navigation.hide();
			}
		}

		function handle_keyup(e) {
			if (!nav_elem.classList.contains('--overlay')) return;

			if (e.key === 'Escape') {
				window.x.navigation.hide();
			}
		}

		function handle_media_query(e) {
			e.matches ? window.x.navigation.hide() : window.x.navigation.stick();
		}

		media_query.addListener(handle_media_query);
		document.addEventListener('click', handle_click);
		document.addEventListener('keyup', handle_keyup);

		return {
			destroy() {
				media_query.removeListener(handle_media_query);
				document.removeEventListener('click', handle_click);
				document.removeEventListener('keyup', handle_keyup);
			}
		};
	}
</script>

<div class="container no-js" use:js>
	{#if data.banner}
		<aside class="banner">
			{@html data.banner}
		</aside>
	{/if}

	<div class="page-container">
		<nav
			aria-label="Main Navigation"
			id="navigation"
			class="navigation"
			use:navigation={{ toggle_selector: '.navigation-button' }}
		>
			{#each Object.entries(data.navigation.links) as [heading, links]}
				{#if heading !== 'default'}
					<div class="navigation__heading">{heading}</div>
				{/if}
				{#each links as link}
					<ul class="navigation__list">
						<li class="navigation__item">
							<a
								class="navigation__link"
								href={link.path}
								aria-current={$page.url.pathname.startsWith(link.path)}
							>
								<span>{link.title}</span>
								{#if link.info}
									<span class="link__info">{link.info}</span>
								{/if}
							</a>
						</li>
					</ul>
				{/each}
			{/each}

			<hr />

			<div class="navigation__item">
				<button class="navigation__link">Light</button>
			</div>

			<form class="navigation__item" action="/logout" method="POST">
				<button class="navigation__link">Logout</button>
			</form>
		</nav>

		<div class="page">
			<header class="page__header">
				<a class="navigation-link" href="#navigation">Menu</a>
				<button class="navigation-button" on:click={window.x.navigation.show}>Menu</button>
			</header>

			<main class="page__content">
				<div>PAGE</div>
				<slot />
			</main>
		</div>
	</div>
</div>

<style>
	.container {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		overflow-x: hidden;
	}

	.page-container {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		flex: 1;
		position: relative;
	}

	.banner {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.navigation-link,
	.navigation-button {
		display: none;
		padding-inline: 1rem;
		padding-block: 0.5rem;
		background-color: rgba(0, 0, 0, 0.8);
		border-radius: 7px;
		border: none;
		color: white;
		font-weight: 700;
    text-decoration: none;
	}

	.navigation {
		--width: 16rem;

		flex: 0 0 auto;
		width: var(--width);
		padding: 1.5rem;
		background-color: #f6f1f1;
	}

	.navigation__heading {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		opacity: 0.75;
		padding-inline: 1rem;
	}

	.navigation__list {
		list-style: none;
		display: flex;
		flex-direction: column;
		row-gap: 0.6rem;
	}

	.navigation__link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		text-decoration: none;
		padding-inline: 1rem;
		padding-block: 0.5rem;
		color: inherit;
		border-radius: 0.3rem;

		transition: scale 100ms;
	}

	button.navigation__link {
		appearance: none;
		border: none;
		background-color: transparent;
	}

	.navigation__link:active {
		scale: 0.96;
	}

	.navigation__link[aria-current='true'] {
		font-weight: 700;
		background-color: white;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	}

	.link__info {
		font-size: 0.8rem;
		font-weight: 700;
		line-height: 1;
		color: white;
		background-color: #e03131;
		min-width: calc(2 * 0.25rem + 0.8rem);
		padding: 0.25rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		opacity: 0.9;
		border-radius: 9999px;
	}

	.page {
		flex: 1;
		padding: 1rem;
	}

	.page__header {
	}

	@media (max-width: 800px) {
		.page__content {
			height: 80rem;
		}

		:global(.no-js) .page-container {
			flex-direction: column-reverse;
		}

		:global(.no-js) .navigation {
			height: auto;
			--width: auto;
		}

		:global(.no-js) .navigation-link {
			display: inline-block;
		}

		:global(.js) .navigation-button {
			display: inline-block;
		}

		:global(.js) .navigation {
			height: 100%;
			position: absolute;
			z-index: 1001;
			inset-inline-start: calc(-1 * var(--width));

			transition: inset-inline-start 300ms;
		}

		:global(.js .navigation.--overlay) {
			inset-inline-start: 0px;
		}
	}
</style>
