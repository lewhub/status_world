(function(){
    angular.module("blog_universe")
        .factory("status_fac", status_fac)

        status_fac.$inject = ["$http"];

        function status_fac($http) {
            // var api = "https://status-universe.herokuapp.com/statuses/";
            // var api_like = "https://status-universe.herokuapp.com/statuses/like-status/";
            // var api_dislike = "https://status-universe.herokuapp.com/statuses/dislike-status/";
            var api = "/statuses/";
            var api_like = "/statuses/like-status/";
            var api_dislike = "/statuses/dislike-status/";
            var service = {
                create: create,
                delete_status: delete_status,
                update_status: update_status,
                like_status: like_status,
                dislike_status: dislike_status,
                show: show
            }
            return service;

            function create(id, data) {
                return $http.post(api + id, data);
            }

            function delete_status(id) {
                return $http.delete(api + id);
            }

            function update_status(id, data) {
                return $http.patch(api + id, data);
            }

            function like_status(id, data) {
                return $http.post(api_like + id, data);
            }

            function dislike_status(id, data) {
                return $http.post(api_dislike + id, data);
            }

            function show(id) {
                return $http.get(api + id);
            }

        }

}())