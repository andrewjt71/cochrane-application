<?php

require_once __DIR__.'/../vendor/autoload.php';

use SilexBase\Application;
use Cochrane\Controller\FrontController;

$app = new Application();

$app['controller.front_controller'] = function() use ($app) {
    return new FrontController($app['twig']);
};

$app->get('/', "controller.front_controller:indexAction");

$app->get('/about', "controller.front_controller:aboutAction");

$app->get('/contact', "controller.front_controller:contactAction");


$app->run();
