var app = angular.module("deck-builder", ["ui"]);

app.controller("LibraryCtrl", function LibraryCtrl($scope, $http) {
    $http.get("library.json").success(function(data) {
        $scope.library = data;
    });

    $scope.filterLibrary = function(card) {
        return _($scope.filters)
            .map(function(filter) {
                return filter.split(":")
            })
            .groupBy(_.head)
            .every(function(pairs) {
                return _.some(pairs, function(pair) {
                    var attr = pair[0], val = pair[1];
                    return card[attr] === val;
                });
            })
            .valueOf();
    }
});
