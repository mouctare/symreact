<?php

namespace App\EventSubscriber;
use Symfony\Component\HttpKernel\Event;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;


class CustomerUser implements EventSubscriberInterface 
{
    public static function getSubscribedEvents()
    {

        return [
            KernelEvents:: VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCustomer(ViewEvent $event) {
        $customer = $event->getControllerResult();
        
        $method = $event->getRequest()->getMethod();
        
        if($customer instanceof Customer && $method === 'POST') {
        $user = $this->security->getUser();
        $customer->setUser($user);
        }
        }
        
    }
        
        