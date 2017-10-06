myApp.controller('shipmentsDetailsCtrl', ['$scope', '$stateParams', '$http', 'ionicToast', 'SharedDataService', 'TimelineViewService','HelperService',
  function ($scope, $stateParams, $http, ionicToast, SharedDataService, TimelineViewService, HelperService) {
    console.log($stateParams);

    $scope.recallFlag = 0;  //Toggle recall button

    service = HelperService;
    console.log("Service",service)
    $http.get(backendUrl + "/drug/" + $stateParams.shipmentId + "/1/verify")
      .success(function (response) {
        console.log("Drug get Success!", response);
        $scope.tradeDetails = response.data.tradedetails;
        $scope.verificationStatus = response.data.verificationstatus;
        $scope.drugTrade = response.data.tradedetails.drugtrade;
        $scope.tradeFlow = response.data.tradedetails.tradeflow;
        SharedDataService.TradeInfo = $scope.tradeFlow;

        // Barcode generate
        JsBarcode("#barcode")
        .options({ font: "OCR-B", displayValue: false, width: 5, height: 25, margin: 0 }) // Will affect all barcodes
        .pharmacode(($scope.drugTrade.lotnumber) % 1000, { fontSize: 18, textMargin: 0 })
        .blank(2) // Create space between the barcodes
        .render();

        $('#verifyResults').show();

      }).catch(function (err) {
        console.log(err);
        ionicToast.show('drugs_trades stream data not found! ', 'bottom', false, 5000);
      });

    $http.get(backendUrl + "/drugrecall/" + $stateParams.shipmentId + "/1/verify")
      .success(function (response) {
        console.log("Drug get Success!", response);
        $scope.recallFlag = 1;
      }).catch(function (err) {
        console.log(err);
        $scope.recallFlag = 0;
      });

    // Timeline view logic
    $scope.$on("$ionicView.afterEnter", function () {
      TimelineViewService.timeline($scope);
    });


    $scope.ToggleUnitFlag = function(arg){
      service.toggleShow(arg);
    }

    $scope.RecallDrug = function () {
      console.log("recalled")
      post_data = {};
      post_data.senderId = 1;
      post_data.tradeDetails = $scope.tradeDetails;
      console.log('post_data.tradeDetails', post_data.tradeDetails)
      console.log("post_data", post_data);
      $http.post(backendUrl + "/drugrecall/", post_data).then(function (response) {
        ionicToast.show('Lot #' + post_data.tradeDetails.drugtrade.lotnumber + 'revoked succesfully!', 'bottom', false, 5000);
        console.log("Revocation Success", response);
      }, function (response) {
        console.log("Revocation Failure", response);
        ionicToast.show('There was an error, please try again!', 'bottom', false, 5000);
      });
    }
  }]);
