<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * L'encoder de mot de passe
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder; 

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;

    }

    public function load(ObjectManager $manager)
    {

        $faker = Factory::create('fr_FR'); // Pour générer que des noms français

       // $chrono = 1;


        for($u = 0; $u < 10; $u++) {
            $user = new User();
            

            $chrono = 1; // A chaque j'arejistre un nouvau user la facture part de 1

            $hash = $this->encoder->encodePassword($user,"password");
             // L'entité pour laquelle on cherche à encoder , c'est un user
             
            $user->setFirstName($faker->firstName())
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($hash);

            $manager->persist($user);


            for($c = 0; $c < mt_rand(5,20); $c++) { // Pour générer rapidement les données avec fixtures on utilise toujours une boucle for
            $customer = new Customer();
            $customer->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName)
                    ->setCompany($faker->company)
                    ->setEmail($faker->email)
                    ->SetUser($user);

             $manager->persist($customer);

            for($i = 0; $i < mt_rand(3,10); $i++) { // Pour créer aléatoirement entre 3 et 10 factures
                $invoice = new Invoice();
                $invoice->setAmount($faker->randomFloat(2,250, 500))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT','PAID', 'CANCELLED']))
                        ->setCustomer($customer) // C'est juste le customer d'en dessus
                        ->setChrono($chrono);
                        $chrono++;

             $manager->persist($invoice);


            }

        }


        
    
        $manager->flush();
    }
}
}