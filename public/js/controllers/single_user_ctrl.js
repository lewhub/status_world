(function(){
    angular.module("blog_universe")
        .controller("SingleUserCtrl", SingleUserCtrl)

        SingleUserCtrl.$inject = ["$stateParams", "user_fac", "$window", "$state", "status_fac"];

        function SingleUserCtrl($stateParams, user_fac, $window, $state, status_fac) {
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

            vm.comment_icon_up = function(evt) {
                var icon = angular.element(evt.target);
                icon.removeClass("fa-commenting");
                icon.addClass("fa-commenting-o");
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

        }


}())