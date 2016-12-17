var app = angular.module('starter.controllers', ['ngCordovaOauth', 'LocalStorageModule'])
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('MyFBAPP')
        .setNotify(true, true);
});

app.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $cordovaOauth, localStorageService, $http,$rootScope) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.interval=50;
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isLoggedIn=false;
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, $scope.interval);
    };
    $scope.fbButtonLabel = "Login with Facebook";
    $rootScope.Facebookname="Guest !";
    $scope.fetchData= function(){
        console.log("fetchData");
         $http.get("https://graph.facebook.com/v2.2/me", {
                params: {
                    access_token: $scope.data,
                    fields: "name",
                    format: "json"
                }
            }).then(function (result) {
                console.log(result.data.name);
                $rootScope.Facebookname = result.data.name;
            }, function (error) {
                alert("Error: " + error);
            });
    };
    
    if (!angular.isUndefined(localStorageService.get('FBTOKEN')) && localStorageService.get('FBTOKEN') != null) {
        $scope.data = localStorageService.get('FBTOKEN');
        $scope.fbButtonLabel = "Logout."
        $scope.fetchData();
        $scope.isLoggedIn=true;
    } else {
        //Not logged in yet show login dialog
        $scope.isLoggedIn=false;
         $timeout(function () {
            $scope.login();
        }, $scope.interval);
    }
    $scope.facebookLogin = function () {
        if (!angular.isUndefined(localStorageService.get('FBTOKEN')) && localStorageService.get('FBTOKEN') != null) {
            $scope.data = localStorageService.get('FBTOKEN');
            $scope.fbButtonLabel = "Logout."
            console.log("Token exist fetching data");
            $scope.fetchData();
            
        } else {
            console.log("Fb else");
            $cordovaOauth.facebook("756869907793494", ["email"]).then(function (result) {
                // results
                $scope.result = result;
                console.log('Doing login');
                $scope.data = result.access_token;
                localStorageService.set('FBTOKEN', $scope.data);
                $scope.fbButtonLabel = "Logout."
                $scope.isLoggedIn=true;
                $timeout(function () {
                    $scope.closeLogin();
                }, $scope.interval);
                
                $scope.fetchData();
            }, function (error) {
                // error
                $scope.isLoggedIn=false;
                console.log("TAG", error);
                alert("Error : " + error);
            });
        }
    };
    
    $scope.logout=function(){
        localStorageService.remove('FBTOKEN');
        $scope.fbButtonLabel = "Login with Facebook";
        $scope.isLoggedIn=false;
        $rootScope.Facebookname="Guest !";
         $timeout(function () {
            $scope.login();
        }, $scope.interval);
    };
});

app.controller('PlaylistsCtrl', function ($scope) {
   
});

app.controller('PlaylistCtrl', function ($scope, $stateParams) {});