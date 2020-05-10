<?php

namespace App\Dotrine;
use App\Entity\User;
use App\Entity\Offer;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;




 class CurrentUserExtention implements QueryCollectionExtentionInterface,QueryItemExtensionInterface 
 {
     private $security;
     private $auth;
     
     public function __construct(Security $security , AuthorizationCheckerInterface $checker)
     {
         $this->security = $security;

         $this->auth = $checker;


     }


     private function addWere(QueryBuilder $queryBuilder,string $resourceClass) {


        $user = $this->security->getUser();



        // 2. Si on demande des invoices ou des customers, alors, agir sur la requete pour qu'elle tienne
        // compte de  l'utilisateur connecté

        if(($resourceClass === Customer::class || $resourceClass === Invoice::class) 

        && 
        
        !$this->auth->isGranted('ROLE_ADMIN') 
        
        && 
        
        $user instanceof User
        
        ) {

            $rootAlias = $queryBuilder-getRootAliases()[0];

            if($resourceClass === Customer::class) {
                $queryBuilder->andwhere("rootAlias.user = :user");


            } else if($resourceClass === Invoice::class) {
                $queryBuilder->join("$rootAlias.customer","c")
                             ->andwhere("c.user = :user");
            }

            $queryBuilder->setParameter("user",$user);


     }

     $this-addWere($queryBuilder,$resourceClass);

    }

    public function applyToCollection(QueryBuilder $queryBuilder,
     QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        // 1. Obtenir l'utilisateur connecté

        $user = $this->security->getUser();


        // 2. Si on demande des invoices ou des customers, alors, agir sur la requete pour qu'elle tienne
        // compte de  l'utilisateur connecté

        if($resourceClass === Customer::class || $resourceClass === Invoice::class) {

            $rootAlias = $queryBuilder-getRootAliases()[0];

            if($resourceClass === Customer::class) {
                $queryBuilder->andwhere("rootAlias.user = :user");


            } else if($resourceClass === Invoice::class) {
                $queryBuilder->join("$rootAlias.customer","c")
                             ->andwhere("c.user = :user");
            }

            $queryBuilder->setParameter("user",$user);
            
        }

    }
    
    

public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator,
 string $resourceClass, array $identifiers, string $operationName = null, array $context = [])
{
     $this->addWere($queryBuilder,$resourceClass);
    
}



 }
 
 