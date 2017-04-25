
// Entities

var Person = function(id, givenName, famillyName) {
    this.id = id;
    this.givenName = givenName;
    this.famillyName = famillyName;
    return this;
}

// Main Controller

var myApp = angular.module('myApp', []);

myApp.controller('MainController', ['$scope', "$http", "$interval", "$log", function($scope, $http, $interval, $log) {
 
    // Init fields
    var maxId = 0;

    // Init properties
    $scope.sortOrder = "+famillyName";
    $scope.infoMessage = "Hide Info";
    $scope.infoAvailable = true;
    $scope.newGivenName = "Given Name";
    $scope.newFamillyName = "Familly name";
    $scope.seconds = 0;

    // Init Methods
    $scope.TroggleInfo = function(){
        if ($scope.infoAvailable) {
            $scope.infoAvailable = false;
            $scope.infoMessage = "Show Info";
        } else {
            $scope.infoAvailable = true;
            $scope.infoMessage = "Hide Info";   
        }
    }

    $scope.ChangeFamillyName = function(name) {
        $scope.newFamillyName = name;
    }

    $scope.ChangeGivenName = function(name) {
        $scope.newGivenName = name;
    }

    $scope.AddContact = function() {
        $scope.people.push(new Person( ++maxId, $scope.newGivenName, $scope.newFamillyName));
        $log.info("Added Contact With ID : " + maxId);
    }

    $scope.DeleteContact = function(id) {
        for (var i=0; i < $scope.people.length; i++) {
            if ($scope.people[i].id === id) {
                $scope.people.splice(i, 1);
                break;
            }
        }

        $log.info("Deleted contact of ID : " + id);
    }

    $scope.UpdateOrder = function(sortOrder) {
        // needed to let it work inside a include
        $scope.sortOrder = sortOrder;
    }

    // Read the model
    $http.get("REST").then(function(response) {
        $scope.message = response.data.message;
        $scope.listItems = response.data.items;
        $scope.people =  response.data.people;
        for (var i=0; i < $scope.people.length; i++) {
            if (maxId < $scope.people[i].id) {
                maxId = $scope.people[i].id;
            }
        }

        $log.info("Last ID used : " + maxId);
    });

    // Time counter
    var IncrementCounter = function() {
        $scope.seconds++;
    }

    // Count time elapsed
    $interval(IncrementCounter, 1000);
}]);

