<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {

        $faker = Factory::create('fr_FR'); // Pour générer que des noms français

        for($c = 0; $c < 30; $c++) { // Pour générer rapidement les données avec fixtures on utilise toujours une boucle for
            $customer = new Customer();
            $customer->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName)
                    ->setCompany($faker->company)
                    ->setEmail($faker->email);

            $manager->persist($customer);

            for($i = 0; $i < mt_rand(3,10); $i++) { // Pour créer aléatoirement entre 3 et 10 factures
                $invoice = new Invoice();
                $invoice->setAmount($faker->randomFloat(2,250, 500))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT','PAID', 'CANCELLED']))
                        ->setCustomer($customer); // C'est juste le customer d'en dessus

             $manager->persist($invoice);


            }


        
    
        $manager->flush();
    }
}
}