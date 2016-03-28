/**
 * Contrôleur de la page signup.
 */
var SignupController = function($scope, $location, $http, $httpParamSerializer, $cookies) {

	/**
	 * client-id:secret
	 */
	$scope.authorization = btoa("clientIdPassword:secret");

	/**
	 * Méthode signin
	 */
	$scope.signup = function() {
		var data = $scope.signup;

		var data = {
			"email": $scope.signup.email,
			"hashedPassword": $scope.signup.password
		};

		$http({
			url: "http://localhost:9091/planning-authorization-server/user/register",
			method: "POST",
			accept: "application/json",
			data: data,
			headers: {
			  "Content-type": "application/json; charset=utf-8"
			}
		}).then(
        	function(successCallback) {
        		$location.path('/signin').replace();
        	},
        	function(errorCallaback) {
        	    alert(errorCallaback.data.error_description);
        	}
        ); 
	};

	/**
     * Méthode authentification
     */
    $scope.isAuthenticated = function() {
        var accessToken = $cookies.get("access_token");
        if (!accessToken) {
            // On redirige vers la page de connexion
            $location.path('/signin').replace();
        }
        return accessToken;
    };
};

// On injecte les dépendences dans le contrôleur
SignupController.$inject = ["$scope", "$location", "$http", "$httpParamSerializer", "$cookies"];

// On enregistre le contrôleur auprès du module de l'application
angular.module("application").controller("SignupController", SignupController);