(function(){
	angular.module("blog_universe")
		.factory("user_fac", user_fac)
	user_fac.$inject = ["$http"]
	function user_fac($http){
		var api = "https://status-universe.herokuapp.com/users/";
		var api_pw_url = "https://status-universe.herokuapp.com/users/password-change/";
		var api_pw_url_confirmed = "https://status-universe.herokuapp.com/users/password-change-confirmed/";
		var api_follow = "https://status-universe.herokuapp.com/users/follow/";
		var api_unfollow = "https://status-universe.herokuapp.com/users/unfollow/";

		// var api = "/users/";
		// var api_pw_url = "/users/password-change/";
		// var api_pw_url_confirmed = "/users/password-change-confirmed/";
		// var api_follow = "/users/follow/";
		// var api_unfollow = "/users/unfollow/";

		var service = {
			index: index,
			show: show,
			create: create,
			update: update,
			remove_user: remove_user,
			login: login,
			check_password: check_password,
			change_password: change_password,
			follow: follow,
			unfollow: unfollow
		}
		return service;

		function index(){
			return $http.get(api);
		}
		function show(id){
			return $http.get(api + id);
		}
		function create(data){
			return $http.post(api, data);
		}
		function update(id, data){
			return $http.patch(api + id, data);	
		}
		function remove_user(id){
			return $http.delete(api + id);
		}
		function login(data){
			return $http.post(api + "login", data);
		}
		function check_password(id, data){
			return $http.patch(api_pw_url + id, data);
		}
		function change_password(id, data){
			return $http.patch(api_pw_url_confirmed + id, data);
		}
		function follow(id, data) {
			return $http.post(api_follow + id, data);
		}
		function unfollow(id, data) {
			return $http.post(api_unfollow + id, data);
		}
	}
}())
