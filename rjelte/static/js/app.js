'use strict';
// angular.module('til', ['ui.router', 'ui.bootstrap', 'til.controllers', 'gantt', 'til.directives', 'til.services', 'LocalStorageModule', 'angularSpinner'])
angular.module('til', ['ui.router', 'ui.bootstrap', 'main.controllers', 'LocalStorageModule', 'angularSpinner'])
.config(function($urlRouterProvider, $stateProvider, $httpProvider, $interpolateProvider) {
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
		$interpolateProvider.startSymbol('{$');
	    $interpolateProvider.endSymbol('$}');
		$urlRouterProvider.otherwise("/");
		$stateProvider
		// .state('home', {
		// 	url: "/",
		// 	templateUrl: "/static/partials/home.html",
		// 	controller: 'MainCtrl'
		// })
		.state('home', {
			url: "/",
			views: {
				"content": {
					templateUrl: "/static/partials/home.html",
				}
			}
		})
		.state('kaunto', {
			url: "/experiments/kaunto",
			views: {
				"content": {
					templateUrl: "/static/partials/kaunto.html",
					controller: "KauntoCtrl",
				}
			}
		})
		// .state('experiments.kaunto', {
		// 	url: "/kaunto",
		// 	templateUrl: "/static/partials/kaunto.html",
		// 	controller: "KauntoCtrl"
		// });
		// .state('experiments.logic', {
		// 	url: "/logic",
		// 	templateUrl: "/static/partials/logic.html",
		// 	controller: 'LogicController'
		// })
		// .state('experiments.tiles', {
		// 	url: "/tiles",
		// 	templateUrl: "/static/partials/tiles.html",
		// 	controller: 'TilesController'
		// })
		// .state('experiments.schedule', {
		// 	url: "/scheduling",
		// 	templateUrl: "/static/partials/schedule.html",
		// 	controller: 'ScheduleController'
		// })
		// .state('experiments.neural', {
		// 	url: "/neural",
		// 	templateUrl: "/static/partials/neural.html",
		// 	controller: 'NeuralController'
		// });
	});

'use strict';