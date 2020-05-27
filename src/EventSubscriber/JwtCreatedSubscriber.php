<?php
   namespace App\EventSubscriber;

   use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;



 
   class JwtCreatedSubscriber 
   {

    public function updateJwtData(JWTCreatedEvent $event) 
    {
        // 1. Récuperer l'utilisateur pour avoir son firstName et lastName
        $user = $event->getUser();
        //2.  Enrichir les data pour qu'elles contiennnent ces données
        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
        

        
    }
}