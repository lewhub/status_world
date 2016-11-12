(function(){
    angular.module("blog_universe")
        .controller("SignUpCtrl", SignUpCtrl)

        SignUpCtrl.$inject = ["user_fac", "$state"];
        // todo -->  make error checking on form and then creating user on backend and then hashing passwords using bcrypt-nodejs.
        function SignUpCtrl(user_fac, $state){
            var vm = this;
            vm.title = "signup ctrl title";

            vm.new_user = new Object();
            
            vm.signup = function() {
                if (vm.new_user.username && vm.new_user.email && vm.new_user.password){
                    if (vm.new_user.password === vm.confirm_password) {
                        console.log(vm.new_user);
                        console.log("creating new user.")
                        user_fac
                            .create(vm.new_user)
                            .then(user_created, err_callback)
                    } else {
                        console.log("user not created. passwords don\'t match.")                        
                    }
                } else {
                    console.log("user not created. all fields must be inputed.");
                }
            }
            function user_created(res) {
                console.log("new user created...");
                console.log(res);
                if (res.data.success){
                    var token = res.data ? res.data.token : null;
                    if (token){
                        console.log(token, "<<< >>> token in signup ctrl.")
                        $state.go("single-user", { id: res.data.user._id });
                    }
                } else {
                    console.log("new user not created. error on backend server.")
                }
            }
            function err_callback(res) {
                console.log("error");
                console.log(res);
            }
        }

       

}())