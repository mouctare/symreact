<?php
namespace Symfony\Component\HttpKernel\Event;

//namespace App\Events;
use App\Entity\User;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;

use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserPasswordSubscriber implements EventSubscriberInterface
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
        
    }
    
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['cryptPassword', EventPriorities::PRE_WRITE]
        ];
    }

    public function cryptPassword(ViewEvent $event)
    {
        $entity = $event->getControllerResult();
        dd($entity);
        $method = $event->getRequest()->getMethod();

        if ($entity instanceof User && $method === "POST"){
            $hash->this->encoder->encodePassword($entity, $entity->getPassword());
                $entity->setPassword($hash);
                
            
            
        }
   

    }

   
}
