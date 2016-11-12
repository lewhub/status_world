(function(){
    angular.module("blog_universe")
        .controller("LoginCtrl", LoginCtrl)

        LoginCtrl.$inject = ["user_fac", "$state"];

        function LoginCtrl(user_fac, $state) {
            var vm = this;
            vm.title = "login ctrl title";
        
            vm.user = new Object();
            vm.login = function(){
                user_fac
                    .login(vm.user)
                    .then(login_success, login_failure)
            }

            function login_success(res) {
                var token = res.data ? res.data.token : null;
                if (token) {
                    console.log("login successful... jwt token below.");
                    console.log(token);
                    $state.go("single-user", { id: res.data.user._id })
                } else {
                    console.log("failed to login successfully.")
                    console.log(res)
                }
            }

            function login_failure(res) {
                console.log("error happened.");
                console.log(res);
            }

        }
}())