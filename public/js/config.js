(function(){
	angular.module("blog_universe")
		.config(function($stateProvider, $urlRouterProvider, $httpProvider){
		$httpProvider.interceptors.push(function($window){
			// todo --> fix console logging doubling up error.
			return {
				"request": function(config){
					var token = $window.localStorage["user-jwt-token"];
					if (token) {
						config.headers["x-access-token"] = token;
						// console.log("user token >>>", token);
					}
					return config;
				},
				"response": function(response){
					if (response.data.token) {
						$window.localStorage["current-user-id"] = response.data.user._id;
						$window.localStorage["user-jwt-token"] = response.data.token;
						$window.localStorage["current-user-username"] = response.data.user.username;
					}
					return response;
				}
			}
		})
		$urlRouterProvider.otherwise("/home");
		$stateProvider
			.state("home", {
				url: "/home",
				templateUrl: "public/partials/home.html",
				controller: "HomeCtrl as home_ctrl"
			})
			.state("single-user", {
				url: "/single-user/:id",
				templateUrl: "public/partials/single_user.html",
				controller: "SingleUserCtrl as single_user_ctrl"
			})
			.state("sign-up", {
				url: "/sign-up",
				templateUrl: "public/partials/sign_up.html",
				controller: "SignUpCtrl as signup_ctrl"
			})
			.state("login", {
				url: "/login",
				templateUrl: "public/partials/login.html",
				controller: "LoginCtrl as login_ctrl"
			})
			.state("feed", {
				url: "/feed/:id",
				templateUrl: "public/partials/feed.html",
				controller: "FeedCtrl as feed_ctrl"
			})
	})
}())
