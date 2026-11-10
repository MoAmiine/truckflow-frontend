// Fixtures provisoires pour les maquettes statiques de J1 (Conformes au contrat API)

export const mockUsers = [
  {
    _id: 'u1',
    nom: 'Admin',
    prenom: 'Super',
    email: 'admin@truckflow.com',
    role: 'admin',
    statut: 'actif'
  },
  {
    _id: 'u2',
    nom: 'Alami',
    prenom: 'Karim',
    email: 'chauffeur@truckflow.com',
    role: 'chauffeur',
    statut: 'actif'
  },
  {
    _id: 'u3',
    nom: 'Bennani',
    prenom: 'Youssef',
    email: 'suspendu@truckflow.com',
    role: 'chauffeur',
    statut: 'suspendu'
  }
];

export const mockCamions = [
  {
    _id: 'c1',
    immatriculation: '12345-A-26',
    marque: 'Volvo',
    modele: 'FH16 750',
    kilometrageActuel: 45000,
    statut: 'disponible'
  },
  {
    _id: 'c2',
    immatriculation: '67890-B-26',
    marque: 'Scania',
    modele: 'R500 V8',
    kilometrageActuel: 82000,
    statut: 'en_mission'
  },
  {
    _id: 'c3',
    immatriculation: '11223-C-26',
    marque: 'Mercedes-Benz',
    modele: 'Actros 1845',
    kilometrageActuel: 120000,
    statut: 'maintenance'
  }
];

export const mockTrajets = [
  {
    _id: 't1',
    siteDepart: 'Youssoufia - Site Central OCP',
    siteArrivee: 'Casablanca - Port Jorf Lasfar',
    marchandise: 'Phosphate Enrichi (25T)',
    dateDepartPrevue: '2026-11-12T08:00:00.000Z',
    dateArriveePrevue: '2026-11-13T18:00:00.000Z',
    statut: 'en_cours',
    chauffeurId: {
      _id: 'u2',
      nom: 'Alami',
      prenom: 'Karim',
      email: 'chauffeur@truckflow.com'
    },
    camionId: {
      _id: 'c2',
      immatriculation: '67890-B-26',
      marque: 'Scania',
      modele: 'R500 V8'
    }
  }
];
