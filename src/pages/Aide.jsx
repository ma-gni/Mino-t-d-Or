/**
 * Aide.jsx
 * --------------------------------------------------
 * Page d'aide et de documentation pour l'application Minot'Or
 * 
 * Cette page fournit :
 * - Des réponses aux questions fréquentes
 * - Des guides d'utilisation pour chaque rôle
 * - Un formulaire de contact pour l'assistance
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';

/**
 * Composant de la page d'aide
 * 
 * @returns {JSX.Element} Page d'aide et documentation
 */
export default function Aide() {
  const { user, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('faq');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Questions fréquentes par catégorie
  const faqCategories = [
    {
      id: 'general',
      title: 'Questions générales',
      questions: [
        {
          id: 'q1',
          question: 'Qu\'est-ce que Minot\'Or ?',
          answer: 'Minot\'Or est une plateforme dédiée à la gestion des commandes et livraisons entre boulangers et meuniers. Elle permet de simplifier les processus de commande, de suivi et de livraison pour tous les acteurs de la chaîne d\'approvisionnement.'
        },
        {
          id: 'q2',
          question: 'Comment puis-je créer un compte ?',
          answer: 'Pour créer un compte, cliquez sur "Inscription" dans le menu en haut à droite. Remplissez le formulaire avec vos informations et choisissez votre rôle. Vous recevrez un email de confirmation pour activer votre compte.'
        },
        {
          id: 'q3',
          question: 'Est-ce que l\'utilisation de la plateforme est gratuite ?',
          answer: 'L\'utilisation de base de Minot\'Or est gratuite pour les boulangers. Les meuniers et autres acteurs de la chaîne disposent de formules d\'abonnement adaptées à leurs besoins. Consultez notre page de tarification pour plus d\'informations.'
        }
      ]
    },
    {
      id: 'boulanger',
      title: 'Pour les boulangers',
      questions: [
        {
          id: 'q4',
          question: 'Comment passer une commande ?',
          answer: 'Pour passer une commande, connectez-vous à votre compte, accédez au catalogue produits depuis votre tableau de bord, sélectionnez les produits désirés et ajoutez-les à votre panier. Validez ensuite votre commande en suivant les étapes indiquées.'
        },
        {
          id: 'q5',
          question: 'Comment suivre l\'état de ma livraison ?',
          answer: 'Vous pouvez suivre l\'état de vos livraisons depuis votre tableau de bord dans la section "Mes commandes". Chaque commande affiche son statut actuel et l\'historique des mises à jour.'
        },
        {
          id: 'q6',
          question: 'Comment déclarer des invendus ?',
          answer: 'Accédez à la section "Déclarer des invendus" depuis votre tableau de bord. Sélectionnez les produits concernés, indiquez les quantités et soumettez votre déclaration. Votre meunier sera automatiquement informé.'
        }
      ]
    },
    {
      id: 'commercial',
      title: 'Pour les commerciaux',
      questions: [
        {
          id: 'q7',
          question: 'Comment gérer les demandes de devis ?',
          answer: 'Accédez à la section "Traitement des devis" depuis votre tableau de bord. Vous y verrez toutes les demandes en attente. Cliquez sur une demande pour la consulter et y répondre avec vos propositions de prix.'
        },
        {
          id: 'q8',
          question: 'Comment ajouter un nouveau produit au catalogue ?',
          answer: 'Dans la section "Catalogue produits", cliquez sur "Ajouter un produit". Remplissez le formulaire avec les informations du produit (nom, description, prix, etc.) et validez pour l\'ajouter au catalogue.'
        }
      ]
    },
    {
      id: 'approvisionnement',
      title: 'Pour l\'approvisionnement',
      questions: [
        {
          id: 'q9',
          question: 'Comment gérer les stocks ?',
          answer: 'La section "Gestion des stocks" vous permet de visualiser les niveaux de stock actuels, d\'ajouter des entrées/sorties et de paramétrer des alertes de stock bas. Vous pouvez filtrer par entrepôt et par produit.'
        },
        {
          id: 'q10',
          question: 'Comment créer un bon de transport ?',
          answer: 'Dans la section "Bons de transport", cliquez sur "Nouveau bon". Sélectionnez les commandes à inclure, le véhicule assigné et la date de livraison prévue. Le système calculera automatiquement l\'itinéraire optimal.'
        }
      ]
    },
    {
      id: 'preparation',
      title: 'Pour la préparation',
      questions: [
        {
          id: 'q11',
          question: 'Comment marquer une commande comme prête ?',
          answer: 'Dans la liste des "Commandes à préparer", sélectionnez la commande concernée et cliquez sur "Marquer comme prête". Vous pouvez également scanner le QR code associé à la commande pour accélérer le processus.'
        },
        {
          id: 'q12',
          question: 'Comment générer un bon de livraison ?',
          answer: 'Accédez à la section "Bons de livraison" et cliquez sur "Générer un nouveau bon". Sélectionnez les commandes à inclure dans le bon et validez. Le système génère automatiquement un PDF téléchargeable et imprimable.'
        }
      ]
    },
    {
      id: 'maintenance',
      title: 'Pour la maintenance',
      questions: [
        {
          id: 'q13',
          question: 'Comment enregistrer le nettoyage d\'une cuve ?',
          answer: 'Dans la section "Suivi des cuves", identifiez la cuve concernée et cliquez sur "Enregistrer un nettoyage". Remplissez le formulaire avec les détails du nettoyage (date, type, observations) et validez.'
        },
        {
          id: 'q14',
          question: 'Comment signaler un problème sur un camion ?',
          answer: 'Accédez à la section "Maintenance camions" et sélectionnez le véhicule concerné. Cliquez sur "Signaler un problème" et décrivez le problème rencontré. Le camion sera automatiquement marqué comme indisponible.'
        }
      ]
    }
  ];
  
  // Guides d'utilisation
  const guides = [
    {
      id: 'guide-boulanger',
      title: 'Guide pour les boulangers',
      description: 'Apprenez à gérer vos commandes et à suivre vos livraisons',
      icon: '🍞',
      link: '/documentation/boulanger'
    },
    {
      id: 'guide-commercial',
      title: 'Guide pour les commerciaux',
      description: 'Gérez efficacement vos clients et vos devis',
      icon: '📋',
      link: '/documentation/commercial'
    },
    {
      id: 'guide-approvisionnement',
      title: 'Guide pour l\'approvisionnement',
      description: 'Optimisez la gestion des stocks et les livraisons',
      icon: '📦',
      link: '/documentation/approvisionnement'
    },
    {
      id: 'guide-preparation',
      title: 'Guide pour la préparation',
      description: 'Simplifiez la préparation des commandes',
      icon: '📄',
      link: '/documentation/preparation'
    },
    {
      id: 'guide-maintenance',
      title: 'Guide pour la maintenance',
      description: 'Suivez efficacement l\'entretien des équipements',
      icon: '🔧',
      link: '/documentation/maintenance'
    }
  ];
  
  // Tutos vidéo
  const videos = [
    {
      id: 'video1',
      title: 'Prise en main de Minot\'Or',
      description: 'Découvrez les fonctionnalités principales de la plateforme',
      duration: '5:32',
      thumbnail: 'https://placehold.co/320x180?text=Tutoriel+1'
    },
    {
      id: 'video2',
      title: 'Comment passer une commande',
      description: 'Guide complet pour les boulangers',
      duration: '4:17',
      thumbnail: 'https://placehold.co/320x180?text=Tutoriel+2'
    },
    {
      id: 'video3',
      title: 'Gestion des stocks et approvisionnement',
      description: 'Optimisez votre gestion des stocks',
      duration: '7:44',
      thumbnail: 'https://placehold.co/320x180?text=Tutoriel+3'
    },
    {
      id: 'video4',
      title: 'Suivi des livraisons',
      description: 'Tout savoir sur le suivi des livraisons',
      duration: '3:59',
      thumbnail: 'https://placehold.co/320x180?text=Tutoriel+4'
    }
  ];
  
  // Filtrer les catégories de FAQ selon le rôle de l'utilisateur
  const getFilteredFAQCategories = () => {
    if (!searchQuery) {
      return faqCategories;
    }
    
    const query = searchQuery.toLowerCase();
    
    return faqCategories.map(category => {
      const filteredQuestions = category.questions.filter(q => 
        q.question.toLowerCase().includes(query) || 
        q.answer.toLowerCase().includes(query)
      );
      
      if (filteredQuestions.length === 0) {
        return null;
      }
      
      return {
        ...category,
        questions: filteredQuestions
      };
    }).filter(Boolean);
  };
  
  // Récupérer les guides pertinents pour l'utilisateur
  const getRelevantGuides = () => {
    if (!isAuthenticated) {
      return guides;
    }
    
    // Déterminer les guides pertinents en fonction du rôle
    const userRole = user?.role;
    
    // Toujours inclure le guide général
    let relevantGuides = guides.filter(guide => 
      guide.id === 'guide-boulanger' || 
      (userRole === ROLES.BOULANGER && guide.id === 'guide-boulanger') ||
      (userRole === ROLES.COMMERCIAL && guide.id === 'guide-commercial') ||
      (userRole === ROLES.APPROVISIONNEMENT && guide.id === 'guide-approvisionnement') ||
      (userRole === ROLES.PREPARATION && guide.id === 'guide-preparation') ||
      (userRole === ROLES.MAINTENANCE && guide.id === 'guide-maintenance')
    );
    
    // Si aucun guide pertinent, renvoyer tous les guides
    return relevantGuides.length > 0 ? relevantGuides : guides;
  };
  
  // Toggle pour les questions de la FAQ
  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  // Changer de section
  const changeSection = (section) => {
    setActiveSection(section);
  };
  
  // Gérer la recherche
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Rendu du contenu de la section active
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'faq':
        const filteredCategories = getFilteredFAQCategories();
        
        return (
          <div className="space-y-8">
            <div className="mb-6">
              <label htmlFor="search" className="sr-only">Rechercher</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">🔍</span>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Rechercher dans la FAQ..."
                />
              </div>
            </div>
            
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun résultat ne correspond à votre recherche.</p>
              </div>
            ) : (
              filteredCategories.map(category => (
                <div key={category.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">{category.title}</h3>
                  </div>
                  <div className="border-t border-gray-200 divide-y divide-gray-200">
                    {category.questions.map(q => (
                      <div key={q.id} className="px-4 py-5 sm:px-6">
                        <button
                          onClick={() => toggleQuestion(q.id)}
                          className="flex justify-between items-center w-full text-left"
                        >
                          <h4 className="text-base font-medium text-gray-900">{q.question}</h4>
                          <span>{expandedQuestions[q.id] ? '▼' : '▶'}</span>
                        </button>
                        
                        {expandedQuestions[q.id] && (
                          <div className="mt-4 text-sm text-gray-500">
                            <p>{q.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        );
        
      case 'guides':
        const relevantGuides = getRelevantGuides();
        
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relevantGuides.map(guide => (
              <Link
                key={guide.id}
                to={guide.link}
                className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{guide.title}</h3>
                    <span className="text-2xl">{guide.icon}</span>
                  </div>
                  <p className="text-gray-500">{guide.description}</p>
                  <div className="mt-4 flex justify-end">
                    <span className="text-indigo-600 text-sm font-medium">Consulter →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        );
        
      case 'videos':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
              <div key={video.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="relative pb-[56.25%] bg-gray-100">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="h-16 w-16 rounded-full bg-indigo-600 bg-opacity-75 flex items-center justify-center">
                      <span className="text-white text-2xl">▶</span>
                    </button>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-medium text-gray-900">{video.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'contact':
        return (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Contactez notre équipe de support</h3>
              <p className="mt-1 text-sm text-gray-500">
                Nous répondons généralement dans un délai de 24 heures ouvrées.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <form className="space-y-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Sujet
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option>Question sur mon compte</option>
                    <option>Problème technique</option>
                    <option>Question sur une commande</option>
                    <option>Suggestion d'amélioration</option>
                    <option>Autre demande</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Décrivez votre problème ou votre question en détail..."
                  />
                </div>
                
                <div>
                  <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                    Pièce jointe (optionnel)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                        >
                          <span>Télécharger un fichier</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF jusqu'à 10Mo</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Centre d'aide</h1>
        <p className="mt-2 text-gray-600">
          Trouvez des réponses à vos questions et apprenez à utiliser Minot'Or efficacement.
        </p>
      </div>
      
      {/* Navigation entre les sections */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => changeSection('faq')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeSection === 'faq'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Questions fréquentes
          </button>
          <button
            onClick={() => changeSection('guides')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeSection === 'guides'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Guides d'utilisation
          </button>
          <button
            onClick={() => changeSection('videos')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeSection === 'videos'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Tutoriels vidéo
          </button>
          <button
            onClick={() => changeSection('contact')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeSection === 'contact'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Contacter le support
          </button>
        </nav>
      </div>
      
      {/* Contenu de la section active */}
      {renderActiveSection()}
    </div>
  );
}
