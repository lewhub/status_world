(function(){
    angular.module("blog_universe")
        .factory("comment_fac", comment_fac)

        comment_fac.$inject = ["$http"];

        function comment_fac($http) {
            var api = "https://status-universe.herokuapp.com/comments/";
            // var api = "/comments/";
            var service = {
                create: create,
                remove_comment: remove_comment,
                show: show
            }
            return service;

            function create(id, data) {
                return $http.post(api + id, data);
            }
            function remove_comment(id) {
                return $http.delete(api + id);
            }
            function show(id) {
                return $http.get(api + id);
            }
        }
}())