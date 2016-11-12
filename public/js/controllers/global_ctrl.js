(function(){
    angular.module("blog_universe")
        .controller("GlobalController", GlobalController)

        GlobalController.$inject = ["$window", "$rootScope", "$state"];

        function GlobalController($window, $rootScope, $state) {
            var vm = this;
            vm.title = "global ctrl title";

            vm.at_profile = false;
            vm.at_signup = false;
            vm.at_login = false;

             vm.current_user_id = function(){
                var id = $window.localStorage["current-user-id"];
                return id;
            }

            $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams){
                console.log(toState, "current state");
                if ($state.is("single-user", {id: vm.current_user_id()})){
                    vm.at_profile = true;
                } else {
                    vm.at_profile = false;
                }
                if ($state.is("sign-up")) {
                    vm.at_signup = true;
                } else {
                    vm.at_signup = false;
                }
                if ($state.is("login")) {
                    vm.at_login = true;
                } else {
                    vm.at_login = false;
                }
            })

            vm.parse_jwt = function(token) {
                var base64Url = token.split(".")[1];
                var base64 = base64Url.replace("-", "+").replace("_", "/");
                return JSON.parse($window.atob(base64));
            }
            vm.is_authed = function() {
                var token = $window.localStorage["user-jwt-token"];
                if (token) {
                    // console.log(token, "token in is authed method")
                    var params = vm.parse_jwt(token);
                   
                    // returns true if token is provided and the token is not expired.
                    return Math.round(new Date().getTime() / 1000) <= params.exp;
                } else {
                    // console.log("no token provided.")
                    // console.log("no token provided or token is expired and you must log in again.");
                    return false;
                }
            }

   
            vm.logout = function(){
                console.log("logging out...");
                $window.localStorage.removeItem("user-jwt-token");
                $window.localStorage.removeItem("current-user-id");
                $state.go("home");
            }

           

        }
}())