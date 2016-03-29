/**
 * Contrôleur de la page signin.
 */
var SigninController = function($scope, $location, $http, $httpParamSerializer, $cookies) {

	/**
	 * client-id:secret
	 */
	$scope.authorization = btoa("clientIdPassword:secret");

	/**
	 * Méthode signin
	 */
	$scope.signin = function() {
		var data = {
			"username": $scope.signin.email,
			"password": $scope.signin.password,
			"grant_type": "password"
		};

		$http({
			url: "http://192.168.0.100:9091/planning-authorization-server/oauth/token",
			method: "POST",
			accept: "application/json",
			data: $httpParamSerializer(data),
			headers: {
			  "Authorization" :"Basic " + $scope.authorization,
			  "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
			}
		}).then(
        	function(successCallback) {
        		$http.defaults.headers.common.Authorization= "Bearer " + successCallback.data.access_token;
        		// On sauvegarde le token d'accès dans un cookie
        		$cookies.put("access_token", successCallback.data.access_token);
        		// On redirige vers la page d'accueil
        		$location.path('/dashboard').replace();
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
SigninController.$inject = ["$scope", "$location", "$http", "$httpParamSerializer", "$cookies"];

// On enregistre le contrôleur auprès du module de l'application
angular.module("application").controller("SigninController", SigninController);