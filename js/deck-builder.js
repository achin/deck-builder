var app = angular.module("deck-builder", ["ui"]);

app.controller("DeckBuilderCtrl", function DeckBuilderCtrl($scope, $http) {
    $scope.filters = [];
    $scope.deck = {};

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

    $scope.cardId = function(card) {
        return card.name.replace(/ /g, "");
    };

    $scope.addCard = function(card) {
        if (!$scope.deck[card.name]) {
            $scope.deck[card.name] = _.merge(card, {count: 0});
        }

        $scope.deck[card.name].count++;
    };

    $scope.removeCard = function(card) {
        if (!$scope.deck[card.name]) {
            return;
        }

        if (--$scope.deck[card.name].count <= 0) {
            delete $scope.deck[card.name];
        }
    };
});
