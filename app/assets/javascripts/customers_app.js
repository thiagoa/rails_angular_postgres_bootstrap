var app = angular.module('customers', ['ngRoute', 'ngResource', 'templates']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    controller: 'CustomerSearchController',
    templateUrl: 'customer_search.html'
  }).when('/:id', {
    controller: 'CustomerDetailController',
    templateUrl: 'customer_detail.html'
  });
}]);

var CustomerSearchController = function($scope, $http, $location) {
  var page = 0, perPage = 10;

  function initializeScope() {
    $scope.search = searchCustomers;
    $scope.previousPage = previousPage;
    $scope.nextPage = nextPage;
    $scope.searchHasResults = searchHasResults;
    $scope.viewDetails = viewDetails;

    hidePagination();
  }

  function hidePagination() {
    $scope.previousPageDisabled = true;
    $scope.nextPageDisabled = true;
  }

  function initialize() {
    initializeScope();
    noCustomers();
  }

  function noCustomers() {
    $scope.customers = [];
  }

  function updateCustomers(data) {
    $scope.previousPageDisabled = isBeginningOfPagination();
    $scope.nextPageDisabled = isEndOfPagination(data.count);

    $scope.customers = data.records;
  }

  function customersFetchError(data, status) {
    alert('There was a problem: ' + status);
  }

  function isBeginningOfPagination() {
    return (page === 0);
  }

  function isEndOfPagination(recordCount) {
    return perPage + (perPage * page) >= recordCount;
  }

  function fetchCustomers(params) {
    $http.get('/customers.json', { params: params })
      .success(updateCustomers)
      .error(customersFetchError);
  }

  function searchCustomers(searchTerm, localPage) {
    if (localPage === undefined) {
      page = localPage = 0;
    }

    if (searchTerm.length < 3) {
      hidePagination();
      return noCustomers();
    }

    fetchCustomers({
      keywords: searchTerm,
      page: localPage,
      per_page: perPage
    });
  }

  function previousPage() {
    if ($scope.previousPageDisabled) {
      return;
    }

    if (page > 0) {
      page = page - 1;
      $scope.search($scope.keywords, page);
    }
  }

  function nextPage() {
    if ($scope.nextPageDisabled) {
      return;
    }

    page = page + 1;
    $scope.search($scope.keywords, page);
  }

  function searchHasResults() {
    return !$scope.previousPageDisabled || !$scope.nextPageDisabled;
  }

  function viewDetails(customer) {
    $location.path('/' + customer.id);
  }

  initialize();
};

var CustomerDetailController = function CustomerDetailController($scope, $routeParams, $resource) {
  var customerId = $routeParams.id;
  var Customer = $resource('/customers/:customerId.json');

  $scope.customerId = customerId;
  $scope.customer = Customer.get({customerId: customerId});
};

var CustomerCreditCardController = function CustomerCreditCardController($scope, $resource) {
  var CreditCardInfo = $resource('/fake_billing.json');

  function fetchCreditCardInfo(cardholderId) {
    $scope.creditCard = CreditCardInfo.get({cardholder_id: cardholderId});
  }

  $scope.fetchCreditCardInfo = fetchCreditCardInfo;
}

app.controller(
  'CustomerSearchController',
  ['$scope', '$http', '$location', CustomerSearchController]
);

app.controller(
  'CustomerCreditCardController',
  ['$scope', '$resource', CustomerCreditCardController]
);

app.controller(
  'CustomerDetailController',
  ['$scope', '$routeParams', '$resource', CustomerDetailController]
);
