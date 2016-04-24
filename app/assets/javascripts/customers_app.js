var app = angular.module('customers', []);

var CustomerSearchController = function($scope, $http) {
  var page = 0;

  $scope.customers = [];

  $scope.search = function(searchTerm) {
    var params;

    if (searchTerm.length < 3) {
      return;
    }

    params = { keywords: searchTerm, page: page }

    $http.get('/customers.json', { params: params })
      .success(function(data, status, headers, config) {
        $scope.customers = data;
      })
      .error(function(data, status, headers, config) {
        alert('There was a problem: ' + status);
      });
  };

  $scope.previousPage = function() {
    if (page > 0) {
      page = page - 1;
      $scope.search($scope.keywords);
    }
  };

  $scope.nextPage = function() {
    page = page + 1;
    $scope.search($scope.keywords);
  }
};

app.controller(
  'CustomerSearchController',
  ['$scope', '$http', CustomerSearchController]
);
