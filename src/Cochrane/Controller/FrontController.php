<?php

namespace Cochrane\Controller;

class FrontController
{
    private $twig;

    function __construct ($twig)
    {
        $this->twig = $twig;
    }

    public function indexAction()
    {
        return $this->twig->render(
            'welcome.html.twig',
            []
        );
    }
}
