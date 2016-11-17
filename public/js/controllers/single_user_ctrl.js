(function(){
    angular.module("blog_universe")
        .controller("SingleUserCtrl", SingleUserCtrl)

        SingleUserCtrl.$inject = ["$stateParams", "user_fac", "$window", "$state", "status_fac", "comment_fac"];

        function SingleUserCtrl($stateParams, user_fac, $window, $state, status_fac, comment_fac) {
            var vm = this;
            vm.title = "single user ctrl title";
            get_user();

            function get_user(){
                user_fac
                    .show($stateParams.id)
                    .then(user_callback, err_callback)
            }

            function user_callback(res){
                console.log(res.data.user);
                vm.user_details = res.data.user;
            }
            function err_callback(res){
                console.log("error");
                console.log(res);
            }

            vm.editing = false;
            vm.changing_password = false;
            vm.new_password = new Object();

            vm.start_password_change = function(){
                console.log("changing password...");
                vm.changing_password = true;
            }

            vm.delete_account = function() {
                console.log("begining the process of deleting your account...")
                local_id = $window.localStorage["current-user-id"];
                user_fac
                    .remove_user(local_id)
                    .then(account_deletion_complete, err_callback)
            }

            function account_deletion_complete(res) {
                console.log("account deleted.")
                console.log(res);
                $state.go("home");
                vm.remove_local_storage();
                console.log("back to home screen.")
            }

            vm.remove_local_storage = function() {
                console.log("removing token and current user id from local storage...");
                $window.localStorage.removeItem("user-jwt-token");
                $window.localStorage.removeItem("current-user-id");
            }

            vm.begin_editing = function(){
                var user_id = vm.user_details._id;
                var local_id = $window.localStorage["current-user-id"];
                if (user_id === local_id){
                    console.log("the same")
                    vm.editing = true;
                } else {
                    console.log("not logged into account with permission to update this profile.")
                }
            }

            vm.save_updates = function() {
                vm.editing = false;
                vm.changing_password = false;
                var local_id = $window.localStorage["current-user-id"];
                if (vm.new_password.current_pw && vm.new_password.new_pw && vm.new_password.confirm_new_pw) {
                    console.log(vm.new_password, "new password object");
                    user_fac
                        .check_password(local_id, { password: vm.new_password.current_pw })
                        .then(confirm_password_change, err_callback)
                }
                var username = angular.element(document.querySelector("#username-edit"));
                var email = angular.element(document.querySelector("#email-edit"));
                console.log(username.val(), email.val(), "angular elements")
                user_fac
                    .update($stateParams.id, {username: username.val(), email: email.val()})
                    .then(show_user, err_callback)
                console.log("saving updates..")
            }

            function confirm_password_change(res){
                console.log(res, "line 65")
                if (res.data.success && vm.new_password.new_pw === vm.new_password.confirm_new_pw){
                    console.log("ready to change in backend")
                    var local_id = $window.localStorage["current-user-id"]; 
                    user_fac
                        .change_password(local_id, { password: vm.new_password.new_pw })
                        .then(password_change_complete, err_callback)
                } else {
                    console.log("not ready to change in backend")
                }
            }

            function password_change_complete(res) {
                console.log("password successfully changed");
                console.log(res);
            }
            
            vm.cancel_changes = function() {
                console.log("canceling changes.")
                var username = angular.element(document.querySelector("#username-edit"));
                var email = angular.element(document.querySelector("#email-edit"));
                var local_id = $window.localStorage["current-user-id"];
                user_fac
                    .show(local_id)
                    .then(get_user_on_cancel, err_callback)
            }

            function get_user_on_cancel(res){
                var user = res.data.user;
                vm.user_details.username = user.username;
                vm.user_details.email = user.email;
                vm.editing = false;
                vm.changing_password = false;
            }


            function show_user(res){
                if (res.data.success){
                    console.log("changes saved");
                    console.log(res);
                } else {
                    console.log("changes not saved.")
                    console.log(res.data.message);
                }
            }

            vm.can_logout = function(){
                if (vm.user_details) {
                    var local_id = $window.localStorage["current-user-id"];
                    var user_id = vm.user_details._id;
                    if (user_id === local_id) {
                        // console.log("able to logout");
                        return true;
                    } else {
                        // console.log("unable to logout. reason: local id and user id don't match.")
                        return false;
                    }
                }
             
            }

            vm.new_status = new Object();

            vm.modal_up = false;
            vm.bring_up_modal = function() {
                console.log("loading modal...");
                vm.modal_up = true;
            }
            vm.close_modal = function() {
                console.log("closing modal...");
                vm.new_status.content = "";
                vm.modal_up = false;
            }

           

            vm.create_new_status = function() {
                console.log("creating new status...");
                console.log(vm.new_status);
                var local_id = $window.localStorage["current-user-id"];
                status_fac
                    .create(local_id, vm.new_status)
                    .then(status_created, err_callback)
            }

            function status_created(res) {
                get_user();
                console.log("status created on backend");
                console.log(res.data);
                vm.modal_up = false;
                vm.new_status.content = "";
            }

            vm.delete_status = function(index, event) {
                if ($window.confirm("Are you sure you want to delete this status?")){
                    console.log("begining to delete status...");
                    var arr_count = vm.user_details.statuses.length - 1;
                    var index_on_backend = arr_count - index;
                    var status_id = vm.user_details.statuses[index_on_backend]._id;
                    status_fac
                        .delete_status(status_id)
                        .then(status_deleted, err_callback)
                } else {
                    console.log("status not deleted...")
                }
                
            }

            function status_deleted(res) {
                console.log("status was deleted...")
                get_user();
                console.log(res);
            }

            vm.edit_modal_up = false;

             vm.close_edit_modal = function() {
                get_user();
                console.log("closing edit modal...");
                vm.edit_modal_up = false;
            
            }

            

            vm.bring_up_edit_modal = function(index, event){
                console.log("bringing up edit modal");
                var div_to_edit = angular.element(event.path[1]);
                div_to_edit.css({"background-color": "#BCED91"});
                vm.edit_modal_up = true;
                var arr_count = vm.user_details.statuses.length - 1;
                var index_on_backend = arr_count - index;
                var status_id = vm.user_details.statuses[index_on_backend]._id;
                var status_content = vm.user_details.statuses[index_on_backend].content;
                vm.status_id = status_id;
                vm.status_content_current = status_content;
            }

            vm.update_current_status = function() {
                console.log("updating status...");
                var content = angular.element(document.querySelector("#modal-textarea-text-edit-form"));
                console.log(content.val(), "edited content");
                if (content.val() !== "") {
                     status_fac
                        .update_status(vm.status_id, { content: content.val() })
                        .then(status_update_confirmed, err_callback)
                }
               
            }

            function status_update_confirmed(res) {
                get_user();
                console.log("status successfully updated...");
                console.log(res);
                vm.edit_modal_up = false;
                vm.status_id = "";
                vm.status_content_current = "";
            }

            vm.heart_button_clicked = function(evt, logged_in) {
                if (logged_in) {
                    var btn = angular.element(evt.target);
                    btn.removeClass("fa-heart-o");
                    btn.addClass("fa-heart heart-btn-change");
                } else {
                    console.log("mouse down but not logged in...");
                }

            }

            vm.heart_button_up = function(evt, status_id, status_content, logged_in){
                if (logged_in) {
                    console.log("liked!", status_id, status_content, $window.localStorage["current-user-id"]);
                    vm.status_like_id = status_id;
                    var local_id = $window.localStorage["current-user-id"];
                    var btn = angular.element(evt.target);
                    btn.removeClass("fa-heart heart-btn-change");
                    btn.addClass("fa-heart-o");
                    status_fac
                        .like_status(status_id, { user_id: local_id })
                        .then(like_status_complete, err_callback)
                } else {
                    console.log("mouse up on heart but not logged in");
                    console.log(logged_in)
                    $window.alert("You must log in to like someone\'s status.\nPlease navigate to the log in page and log in.")
                }
               
            }

            vm.comment_icon_down = function(evt) {
                var icon = angular.element(evt.target);
                icon.removeClass("fa-commenting-o");
                icon.addClass("fa-commenting");
            }


            vm.comment_modal_up = false;
            vm.comment_modal_arr = new Array();

            vm.comment_icon_up = function(evt, content, status_id, comments) {
                var icon = angular.element(evt.target);
                icon.removeClass("fa-commenting");
                icon.addClass("fa-commenting-o");
                vm.comment_modal_up = true;
                vm.comment_content = content;
                vm.comment_status_id_modal = status_id;
                for (var i = 0; i < comments.length; i++) {
                    comment_fac
                        .show(comments[i])
                        .then(add_to_comment_arr, err_callback)
                }
            }
            

            function add_to_comment_arr(res){
                var com = res.data.comment;
                vm.comment_modal_arr.push(com);
            }

            vm.close_comment_modal = function() {
                console.log("closing comment modal...");
                vm.comment_content = "";
                vm.comment_modal_up = false;
                vm.comment_modal_arr = [];
                vm.comment_status_id_modal = "";
                get_user();
            }

            function like_status_complete(res) {
                get_user();
                var local_id = $window.localStorage["current-user-id"];
                console.log("status liked!");
                console.log(res);
                if (!res.data.success) {
                    status_fac
                        .dislike_status(vm.status_like_id, { user_id: local_id })
                        .then(dislike_status_complete, err_callback)
                }
            }

            function dislike_status_complete(res) {
                get_user();
                vm.status_like_id = "";
                console.log("status unliked");
                console.log(res);
            }

            vm.show_liked_users_modal = function(arr, content) {
                console.log("array of users that liked this status...");
                // console.log(arr);
                vm.content_for_like_modal = content;
                vm.arr_for_like_modal = new Array();
                for (var i = 0; i < arr.length; i++) {
                    user_fac
                        .show(arr[i])
                        .then(user_found, err_callback)
                }
            }

            vm.username_modal_up = false;
            function user_found(res) {
                //console.log(res.data.user.username);
                var username = res.data.user.username;
                vm.arr_for_like_modal.push(username);
                // console.log(vm.arr_for_like_modal, "<<<<<");
                // bring up modal with usernames
                vm.username_modal_up = true;
            }

            vm.close_like_modal = function() {
                console.log("closing like modal...")
                vm.username_modal_up = false;
                vm.arr_for_like_modal = [];
                vm.content_for_like_modal = "";
            }


     
            vm.add_comment_to_status = function() {
                console.log("beggining to add comment...");
                var local_username = $window.localStorage["current-user-username"];
                console.log(vm.add_comment_content);
                comment_fac
                    .create(vm.comment_status_id_modal, {content: vm.add_comment_content, username: local_username})
                    .then(comment_create_complete, err_callback)
               
            }

            function comment_create_complete(res) {
                console.log("comment created on backend...");
                console.log(res);
                vm.add_comment_content = "";
                status_fac
                    .show(res.data.status._id)
                    .then(status_found_comment, err_callback)
            }

            function status_found_comment(res) {
                vm.comment_modal_arr = [];
                var comments = res.data.status.comments
                console.log(res.data.status.comments)
              
                console.log("status found <<<<>>>>")
                  for (var i = 0; i < comments.length; i++) {
                    comment_fac
                        .show(comments[i])
                        .then(add_to_comment_arr, err_callback)
                }
            }

            vm.delete_comment_modal = function(comment_id) {
                console.log("beginning to delete comment...");
                console.log(comment_id);
                comment_fac
                    .remove_comment(comment_id)
                    .then(comment_delete_complete, err_callback)
            }

            function comment_delete_complete(res) {
                console.log("comment deleted...");
                console.log(res);
                vm.comment_modal_arr = [];
                var comments = res.data.status.comments

                for (var i = 0; i < comments.length; i++) {
                    comment_fac
                        .show(comments[i])
                        .then(add_to_comment_arr, err_callback)
                }
            }

            vm.can_delete_comment = function(username){
                if (username === $window.localStorage["current-user-username"]) {
                    return true;
                } else {
                    return false
                }
            }


            vm.comment_like_down = function(evt) {
                var icon = angular.element(evt.target);
                icon.removeClass("fa-thumbs-o-up");
                icon.addClass("fa-thumbs-up");
            }

            vm.comment_like_up = function(evt, comment_id) {
                vm.show_who_liked = false;
                vm.comment_like_id = comment_id;
                vm.comment_evt = evt;
                console.log("comment liked!");
                var icon = angular.element(evt.target);
                var local_id = $window.localStorage[ "current-user-id" ];
                icon.removeClass("fa-thumbs-up");
                icon.addClass("fa-thumbs-o-up");
                console.log(comment_id);
                comment_fac
                    .like_comment(comment_id, { user_id: local_id })
                    .then(like_comment_complete, err_callback)
            }

            function like_comment_complete(res) {
                console.log("comment liked on backend!")
                console.log(res)
                if (!res.data.success) {
                    comment_fac
                        .dislike_comment(vm.comment_like_id, { user_id: res.config.data.user_id } )
                        .then(comment_dislike_complete, err_callback)
                } else {
                    var span_text = angular.element(vm.comment_evt.target.parentElement.children[5].children[1]);
                    span_text.text(res.data.comment.likes.length);
                }
            }

            function comment_dislike_complete(res) {
                console.log("comment disliked...");
                console.log(res);
                vm.comment_like_id = "";
                var span_text = angular.element(vm.comment_evt.target.parentElement.children[5].children[1]);
                span_text.text(res.data.comment.likes.length);
            }

            vm.show_who_liked = false;
            vm.comment_likes_modal_arr = new Array();
            vm.show_comment_like_users = function(comment_id) {
                if (!vm.show_who_liked) {
                    comment_fac
                        .show(comment_id)
                        .then(comment_found_with_user_ids, err_callback)
                }
            }

            function comment_found_with_user_ids(res) {
                console.log("comment found!")
                console.log(res.data.comment.likes);
                console.log(res.data.comment.content, "<<< comment to show content... >>>>>")
                vm.comment_content_for_like_ul = res.data.comment.content;
                var user_ids = res.data.comment.likes;
                
                for (var i = 0; i < user_ids.length; i++ ) {
                    user_fac
                        .show(user_ids[i])
                        .then(user_found_for_comment_like_modal, err_callback)
                }

                vm.show_who_liked = true;

            }

            function user_found_for_comment_like_modal(res) {
                console.log("username found!");
                // console.log(res.data.user.username);
                var username = res.data.user.username;
                vm.comment_likes_modal_arr.push(username);
            }

            vm.close_comment_like_modal = function() {
                vm.show_who_liked = false;
                 vm.comment_likes_modal_arr = [];
            }



            // follow and unfollow

            vm.follow = function() {
                console.log("beggining to follow user...");
                var local_id = $window.localStorage["current-user-id"];
                var user_to_follow_id = vm.user_details._id;
                user_fac
                    .follow(local_id, { user_to_follow: user_to_follow_id } )
                    .then(follow_complete, err_callback)
            }

            function follow_complete(res) {
                console.log("user followed on backend!");
                console.log(res);
                if (!res.data.success) {
                    user_fac
                        .unfollow( res.data.user._id, { user_to_unfollow: res.data.user_to_follow._id } )
                        .then(unfollow_complete, err_callback)
                } else {
                    get_user();
                }

            }

            function unfollow_complete(res) {
                console.log("user unfollowed...");
                console.log(res);
                get_user();
            }

            vm.check_if_following = function(evt) {
                console.log("checking if you are following this user...");
                var follow_btn = angular.element(evt.target);
                var local_id = $window.localStorage["current-user-id"];
                var user_to_follow_followers = vm.user_details.followers;
                if (user_to_follow_followers.indexOf(local_id) !== -1) {
                    follow_btn.val("Unfollow");
                    follow_btn.css( { "margin-left": "436px" } );
                }
            }

            vm.change_back_to_default = function(evt) {
                var follow_btn = angular.element(evt.target);
                follow_btn.val("Follow");
                follow_btn.css( { "margin-left": "463px" } );
            }

            vm.check_if_on_profile = function() {
                
                if (vm.user_details) {
                    var id = vm.user_details._id;
                    var local_id = $window.localStorage["current-user-id"];
                    if (id === local_id) {
                        console.log("viewing profile")
                        return false;
                    } else {
                        return true;
                    }
                }
              
            }

            vm.followers_icon_down = function(evt) {
                var icon = angular.element(evt.target);
                icon.removeClass("fa-caret-down");
                icon.addClass("fa-caret-square-o-down");
            }

            vm.followers_modal_arr = new Array();
            vm.show_followers_modal = false;

            vm.followers_icon_up = function(evt) {
                console.log("beggining to show followers...");           
                var icon = angular.element(evt.target);
                icon.removeClass("fa-caret-square-o-down");
                icon.addClass("fa-caret-down");
                var followers = vm.user_details.followers;
                for ( var i = 0; i < followers.length; i++ ) {
                    user_fac
                        .show(followers[i])
                        .then(add_user_to_followers_modal_arr, err_callback)
                }

                vm.show_followers_modal = true;

            }

            function add_user_to_followers_modal_arr(res) {
                console.log("adding user...");
                var username = res.data.user.username;
                vm.followers_modal_arr.push(username);
            }

            vm.close_followers_modal = function() {
                vm.show_followers_modal = false;
                vm.followers_modal_arr = [];
            }

            vm.following_icon_down = function(evt) {
                var icon = angular.element(evt.target);
                icon.removeClass("fa-caret-down");
                icon.addClass("fa-caret-square-o-down");
            }
            
            // finish showing following modal

            vm.following_icon_up = function(evt) {
                console.log("beggining to show following");
                var icon = angular.element(evt.target);
                icon.removeClass("fa-caret-square-o-down");
                icon.addClass("fa-caret-down");
                var following = vm.user_details.following;
                for ( var i = 0; i < following.length; i++ ) {
                    user_fac
                        .show(following[i])
                        .then(add_user_to_following_modal_arr, err_callback)
                }
                vm.show_following_modal = true;
            }


            //


        }


}())