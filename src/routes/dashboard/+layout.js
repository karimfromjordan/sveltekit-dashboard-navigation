export async function load(event) {
	return {
		navigation: {
				links: {
					default: 
					[
						{ icon:'default',title: 'Overview', path: '/dashboard/overview' },
						{ icon:'default',title: 'Customers', path: '/dashboard/customers' },
						{ icon:'default',title: 'Orders', path: '/dashboard/orders' },
						{ icon:'default',title: 'Notifications', path: '/dashboard/notifications', info: "13" },
						{ icon:'default',title: 'Settings', path: '/dashboard/settings' }
					]
				}
			}
		
	};
}
