(function(){
    angular.module("blog_universe")
        .factory("comment_fac", comment_fac)

        comment_fac.$inject = ["$http"];

        function comment_fac($http) {
            var api = "https://status-universe.herokuapp.com/comments/";
            var api_like_comment = "https://status-universe.herokuapp.com/comments/like-comment/";
            var api_dislike_comment = "https://status-universe.herokuapp.com/comments/dislike-comment/"; 

            // var api = "/comments/";
            // var api_like_comment = "/comments/like-comment/";
            // var api_dislike_comment = "/comments/dislike-comment/"; 

            var service = {
                create: create,
                remove_comment: remove_comment,
                show: show,
                like_comment: like_comment,
                dislike_comment: dislike_comment
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
            function like_comment(id, data) {
                return $http.post( api_like_comment + id, data );
            }
            function dislike_comment(id, data) {
                return $http.post( api_dislike_comment + id, data );
            }
        }
}())