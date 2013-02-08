var app = angular.module("deck-builder", ["ui"]);

app.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
});

app.controller("DeckBuilderCtrl", function DeckBuilderCtrl($scope, $http, $location) {
    $scope.filters = [];
    $scope.deck = {};

    $http.get("library.json").success(function(data) {
        $scope.library = data;
        $scope.libraryIndex = _($scope.library)
            .map(function(card) {
                return [card.name, card];
            })
            .object()
            .valueOf();
        $scope.types = _(data).pluck("type").uniq().valueOf();
        $scope.deck = deckFromMap($location.search(), $scope.libraryIndex);
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

    $scope.addCard = function(card) {
        if (!$scope.deck[card.name]) {
            $scope.deck[card.name] = _.merge(card, {count: 0});
        }

        $scope.deck[card.name].count++;
        updateLocation($scope.deck);
    };

    $scope.removeCard = function(card) {
        if (!$scope.deck[card.name]) {
            return;
        }

        if (--$scope.deck[card.name].count <= 0) {
            delete $scope.deck[card.name];
        }
        updateLocation($scope.deck);
    };

    var deckAsMap = function(deck) {
        return _(deck)
            .map(function(card, cardName) {
                return [card.name, card.count];
            })
            .object()
            .valueOf();
    };

    var deckFromMap = function(m, libraryIndex) {
        return _(m)
            .map(function(count, cardName) {
                return [cardName, _.merge(libraryIndex[cardName], {count: parseInt(count)})];
            })
            .object()
            .valueOf();
    };

    var updateLocation = function(deck) {
        $location.search(deckAsMap(deck));
    };

    $scope.cards = function(deck) {
        return _.values(deck);
    };

    $scope.totalCards = function(deck) {
        return _.reduce(deck, function(sum, card) { return sum + card.count; }, 0);
    };

    $scope.hasCardsOfType = function(deck, type) {
        return _.some(deck, function(card) {
            return card.type === type;
        });
    };
});
