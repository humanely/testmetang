import angular from 'angular';
import angularMeteor from 'angular-meteor';
//import { Tasks } from '../../api/tasks.js';

import template from './header.html';

class HeaderController {
   constructor($scope) {
    
  }

}
 
export default angular.module('headerList', [
  angularMeteor
])
  .component('headerList', {
    templateUrl: 'imports/components/tpl/header.html',
    controller: ['$scope', HeaderController]

});