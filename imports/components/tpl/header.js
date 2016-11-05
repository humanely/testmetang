import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Tasks } from '../../api/tasks.js';

import template from './header.html';

class HeaderControllera {
	  'ngInject';
   constructor($scope,$reactive) {
   	$scope.$watch('$includeContentLoaded', function() {
    	//$window.Layout.initHeader();
    	alert("ssss")
    	console.log($reactive)
    })
  }
}
 
export default angular.module('headerList', [
  angularMeteor
])
  .component('headerList', {
    templateUrl: 'imports/components/tpl/header.html',
    controllerAs:name,
    controller: ['$scope','$reactive', HeaderControllera]

  });