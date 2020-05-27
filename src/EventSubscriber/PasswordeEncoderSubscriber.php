<?php

namespace App\EventSubscriber;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;




class PasswordEncoderSubscriber implements EventSubscriberInterface {
    /** @var UserPasswordEncoderInterface */
    
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        
        $this->encoder = $encoder;
    }

    public static function getSubscribedEvents() 
    { 
        return [
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE] 
            // Ecoute notre class s'appelle VIEW  et elle veut se placer 
            // avant l'ecriture tu appeleras donc avant l'ecriture la methode encodeassword.


        ];


    }

    public function encodePassword(ViewEvent $event) {
       $user =   $event->getControllerResult();
       

       $method = $event->getRequest()->getMethod();
 
       if($user instanceof User && $method === "POST") {
          $hash = $this->encoder->ncodePassword($user,$user->getPassword());
          $user->setPassword($hash);

       }

    }

}