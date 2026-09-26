import { isDevMode } from '@angular/core';
import { Route } from '@angular/router';
import {
	API_BASE_URL,
	DEV_API_CONFIG,
	PRODUCTION_API_CONFIG,
} from '@super-fitness/data-access-user';
import { TodosPageComponent } from '../features/todos/ui/pages/todos-page.component';

export const remoteRoutes: Route[] = [
	{
		path: '',
		component: TodosPageComponent,
		providers: [
			{
				provide: API_BASE_URL,
				useFactory: () =>
					(isDevMode() ? DEV_API_CONFIG : PRODUCTION_API_CONFIG).apiBaseUrl,
			},
		],
	},
];
