/*
* The main module
*/

import * as angular from "angular";
import { MainController } from "./MainController";

export let myApp = angular.module('myApp', []).controller('MainController', MainController);
