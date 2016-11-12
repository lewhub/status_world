(function(){
    angular.module("blog_universe")
        .factory("status_fac", status_fac)

        status_fac.$inject = ["$http"];

        function status_fac($http) {
            var api = "https://status-universe.herokuapp.com/statuses/"
            var service = {
                create: create,
                delete_status: delete_status,
                update_status: update_status
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

        }

}())