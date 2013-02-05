function LibraryCtrl($scope, $http) {
    $http.get("library.json").success(function(data) {
        $scope.library = data;
    });
}
