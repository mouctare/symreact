<?php

namespace App\EventSubscriber;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;


class PasswordEncoderSubscriber implements EnventSubscriberInterface {
    
    
    private $passwordencoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        
        $this->passwordEncoder = $passwordEncoder;
    }
    

      public function getSubscribedEvents()

    {
   
       return [
        KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
        }
        
        public function encodePassword(ViewEvent $event) {
        $user = $event->getControllerResult();
        dd($user);
        
        $method = $event->getRequest()->getMethod();//POST,GET,PUT..
        
        if($user instanceof User && $method === "POST") {
        $hash = $this->encodePassword($user, $user->getPassword());
        $user->getPassword($hash);
        }
        }
        }