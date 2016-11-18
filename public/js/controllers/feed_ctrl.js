(function(){
    angular.module("blog_universe")
        .controller("FeedCtrl", FeedCtrl)

        FeedCtrl.$inject = ["user_fac", "$window"];

        function FeedCtrl(user_fac, $window) {
            var vm = this;
            vm.title = "feed ctrl title";

            get_following_ids();

            function err_callback(res) {
                console.log("error");
                console.log(res);
            }

            function get_following_ids() {
                var local_id = $window.localStorage["current-user-id"];
                user_fac
                    .show( local_id )
                    .then(following_found, err_callback)  
            }

            
            vm.status_feed = new Array();

            function following_found(res) {
                console.log("users found.");
                vm.following = res.data.user.following;
                for ( var i = 0; i < vm.following.length; i++ ) {
                    user_fac
                        .show(vm.following[i])
                        .then(add_user_to_status_feed, err_callback)
                }
            }

            function add_user_to_status_feed(res) {
                console.log("user found for in for loop.");
                var username = res.data.user.username;
                var status_arr = res.data.user.statuses;
                var id = res.data.user._id;
                for ( var i = 0; i < status_arr.length; i++ ) {
                    var obj_to_add = new Object();
                    obj_to_add.username = username;
                    obj_to_add.content = status_arr[i].content;
                    obj_to_add.comment_count = status_arr[i].comments.length;
                    obj_to_add.like_count = status_arr[i].likes.length;
                    obj_to_add.user_id = id;
                    obj_to_add.image = status_arr[i].image;
                    vm.status_feed.push(obj_to_add);
                }
               
            }   



        
        }

}())