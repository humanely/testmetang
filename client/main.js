import angular from 'angular';
import angularMeteor from 'angular-meteor';
import todosList from '../imports/components/todosList/todosList';
import { Tasks } from '/imports/api/tasks';

angular.module('simple-todos', [
  angularMeteor,
  todosList.name
]);