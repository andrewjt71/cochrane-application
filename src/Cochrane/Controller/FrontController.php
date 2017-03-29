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

    public function aboutAction()
    {
        return $this->twig->render(
            'about.html.twig',
            []
        );
    }

    public function contactAction()
    {
        return $this->twig->render(
            'contact.html.twig',
            []
        );
    }
}
