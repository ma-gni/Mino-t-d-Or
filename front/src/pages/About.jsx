import React from 'react';

const About = () => {
  const stats = [
    { number: "41", label: "Entrepôts" },
    { number: "500+", label: "Clients actifs" },
    { number: "24/7", label: "Support client" },
    { number: "15+", label: "Années d'expérience" },
  ];

  const values = [
    {
      title: "Innovation",
      description: "Nous développons constamment de nouvelles solutions pour améliorer la chaîne d'approvisionnement.",
      icon: "💡"
    },
    {
      title: "Qualité",
      description: "Nous garantissons la qualité des produits et services à chaque étape du processus.",
      icon: "⭐"
    },
    {
      title: "Durabilité",
      description: "Nous nous engageons pour un développement durable et responsable.",
      icon: "🌱"
    },
    {
      title: "Proximité",
      description: "Nous maintenons une relation de proximité avec nos clients et partenaires.",
      icon: "🤝"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="section bg-indigo-700 text-white">
        <div className="section-content">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 animate-fade-in">
              À propos de Minot'Or
            </h1>
            <p className="text-xl text-indigo-100 animate-slide-up delay-200">
              Leader dans la gestion de la chaîne d'approvisionnement entre boulangers et minotiers,
              nous innovons pour simplifier vos processus quotidiens.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="section bg-white">
        <div className="section-content">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="section bg-gray-50">
        <div className="section-content">
          <h2 className="heading-2 text-center mb-16 animate-fade-in">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="feature-card text-center animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl mb-4 animate-float">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="section bg-white">
        <div className="section-content">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-8 animate-fade-in">
              Notre mission
            </h2>
            <p className="paragraph mb-8 animate-slide-up delay-200">
              Minot'Or s'engage à révolutionner la chaîne d'approvisionnement entre boulangers et minotiers.
              Notre plateforme innovante permet une gestion simplifiée des commandes, des stocks et des livraisons,
              tout en garantissant la qualité et la traçabilité des produits.
            </p>
            <p className="paragraph animate-slide-up delay-300">
              Nous travaillons chaque jour pour créer un écosystème durable et efficace,
              où la technologie est au service de l'artisanat et de la tradition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
