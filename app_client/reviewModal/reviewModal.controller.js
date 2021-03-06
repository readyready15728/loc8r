(function () {
  var reviewModalCtrl = function ($uibModalInstance, loc8rData, locationData) {
    var vm = this;

    $uibModalInstance.result.catch(function () { $uibModalInstance.close(); });

    vm.locationData = locationData;
    vm.modal = {
      cancel: function () {
        $uibModalInstance.dismiss('cancel');
      },
      close: function (data) {
        $uibModalInstance.close(data);
      }
    };
    vm.addReview = function (locationData, formData) {
      loc8rData.addReviewById(vm.locationData.locationId, {
        rating: formData.rating,
        reviewText: formData.reviewText
      }).then(function (data) {
        vm.modal.close(data);
      }, function (err) {
        vm.formError = 'Your review has not been saved; try again';
      });

      return false;
    };
    vm.onSubmit = function () {
      vm.formError = ''; // reset any existing error message

      if (!vm.formData.rating || !vm.formData.reviewText) {
        vm.formError = 'All fields are required; please try again';
        return false;
      } else {
        vm.addReview(vm.locationData.locationId, vm.formData);
      }
    };
  };

  reviewModalCtrl.$inject = ['$uibModalInstance', 'loc8rData', 'locationData'];

  angular
    .module('loc8r')
    .controller('reviewModalCtrl', reviewModalCtrl);
})();
