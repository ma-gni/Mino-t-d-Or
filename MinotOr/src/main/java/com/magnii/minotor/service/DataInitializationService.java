package com.magnii.minotor.service;

import com.magnii.minotor.model.PageVisit;
import com.magnii.minotor.repository.PageVisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private PageVisitRepository pageVisitRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialiser les données seulement si la base est vide
        if (pageVisitRepository.count() == 0) {
            initializePageVisits();
        }
    }

    private void initializePageVisits() {
        try {
            // Créer des données de page-visits
            PageVisit visit1 = new PageVisit("Accueil", LocalDateTime.now().minusHours(2), "visitor_001");
            pageVisitRepository.save(visit1);

            PageVisit visit2 = new PageVisit("Produits", LocalDateTime.now().minusHours(1), "visitor_002");
            pageVisitRepository.save(visit2);

            PageVisit visit3 = new PageVisit("Contact", LocalDateTime.now().minusMinutes(30), "visitor_003");
            pageVisitRepository.save(visit3);

            PageVisit visit4 = new PageVisit("Accueil", LocalDateTime.now().minusMinutes(15), "visitor_001");
            pageVisitRepository.save(visit4);

            PageVisit visit5 = new PageVisit("À propos", LocalDateTime.now().minusMinutes(5), "visitor_004");
            pageVisitRepository.save(visit5);

            PageVisit visit6 = new PageVisit("Services", LocalDateTime.now().minusMinutes(2), "visitor_005");
            pageVisitRepository.save(visit6);

            System.out.println("✅ Données de page-visits initialisées avec succès !");
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'initialisation des données : " + e.getMessage());
            e.printStackTrace();
        }
    }
} 