(function(){
	angular.module("blog_universe")
		.controller("HomeCtrl", HomeCtrl)
	HomeCtrl.$inject = ["user_fac"]		
	function HomeCtrl(user_fac){
		var vm = this;
		vm.title = "home screen title";

		user_fac
			.index()
			.then(show_users, err_callback)

		function show_users(res){
			console.log("all users >>>", res.data.users);
			vm.all_users = res.data.users;

		}
		function err_callback(res){
			console.log("error...");
			console.log(res)
		}
			
	}
}())
