import React, { useState, useRef, useEffect } from 'react';
import { toPng, toJpeg } from 'html-to-image';
// @ts-ignore
import cardBackground from './assets/images/card_background_1782290811054.jpg';
import { 
  Sparkles, 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  Copy, 
  Search, 
  Image as ImageIcon, 
  RotateCcw, 
  Swords, 
  Shield, 
  Quote, 
  Heart, 
  Check, 
  AlertTriangle, 
  Filter,
  Eye,
  Settings,
  HelpCircle,
  FileImage,
  Crown,
  Skull,
  Crosshair,
  Axe,
  Flame,
  Zap,
  Wind,
  Target,
  Feather
} from 'lucide-react';

// Structure de données d'une carte de guerrier
interface WarriorCard {
  id: number;
  numero: string;
  nom: string;
  rarete: 'C' | 'R' | 'E' | 'L' | 'G'; // C: Commun, R: Rare, E: Épique, L: Légendaire, G: Divin
  surnom: string;
  portraitUrl: string;
  classe: string;
  specialite1: string;
  specialite2: string;
  iconSpecialite1?: string; // Nom de l'icône de spécialité 1
  iconSpecialite2?: string; // Nom de l'icône de spécialité 2
  realisation: string;
  faille: string;
  citation: string;
  theme: 'gold' | 'fire' | 'void' | 'ice' | 'emerald';
  hp: number; // Point de vie de base pour le côté jeu de rôle
  atk: number; // Point d'attaque de base pour le côté jeu de rôle
}

// Liste de données initiale enrichie et diversifiée
const INITIAL_CARDS: WarriorCard[] = [
  {
    id: 1,
    numero: "001",
    nom: "ACHILLE",
    rarete: "G",
    surnom: "Héros Invincible",
    portraitUrl: "https://images.unsplash.com/photo-1599733589046-10c005739ef9?auto=format&fit=crop&w=500&q=80",
    classe: "Guerrier Demi-dieu",
    specialite1: "Combat Rapproché",
    specialite2: "Vitesse Divine",
    realisation: "Seul guerrier grec capable de vaincre Hector devant les murs de Troie.",
    faille: "Son talon non protégé reste sa seule vulnérabilité fatale.",
    citation: "La gloire éternelle vaut bien une vie brève.",
    theme: "gold",
    hp: 98,
    atk: 99
  },
  {
    id: 2,
    numero: "002",
    nom: "LÉONIDAS",
    rarete: "L",
    surnom: "Roi de Sparte",
    portraitUrl: "https://images.unsplash.com/photo-1580130379624-3a069adbffc5?auto=format&fit=crop&w=500&q=80",
    classe: "Hoplite Légendaire",
    specialite1: "Mur de Boucliers",
    specialite2: "Ténacité Absolue",
    realisation: "A tenu tête à l'immense armée persane aux Thermopyles avec seulement 300 hommes.",
    faille: "Le sacrifice ultime par honneur ne laisse aucune chance de survie.",
    citation: "Molon Labe — Viens les prendre.",
    theme: "fire",
    hp: 95,
    atk: 92
  },
  {
    id: 3,
    numero: "003",
    nom: "SUN TZU",
    rarete: "E",
    surnom: "Le Maître de la Guerre",
    portraitUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80",
    classe: "Général Philosophe",
    specialite1: "Grande Stratégie",
    specialite2: "Guerre Psychologique",
    realisation: "A rédigé l'Art de la Guerre, le traité militaire le plus influent de l'Histoire.",
    faille: "Préfère la théorie pure et l'évitement du conflit à l'action physique directe.",
    citation: "Tout l'art de la guerre repose sur la duperie.",
    theme: "emerald",
    hp: 75,
    atk: 88
  },
  {
    id: 4,
    numero: "004",
    nom: "MUSASHI MIYAMOTO",
    rarete: "L",
    surnom: "Le Saint au Sabre",
    portraitUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80",
    classe: "Samouraï Errant",
    specialite1: "Style à Deux Sabres",
    specialite2: "Discipline Mentale",
    realisation: "Invaincu au cours de 61 duels de vie ou de mort et auteur du Traité des Cinq Roues.",
    faille: "Son dédain des conventions et son isolement spirituel extrême.",
    citation: "Sous le sabre levé se trouve l'enfer, faites un pas et c'est le paradis.",
    theme: "void",
    hp: 85,
    atk: 96
  },
  {
    id: 5,
    numero: "005",
    nom: "JEANNE D'ARC",
    rarete: "R",
    surnom: "La Pucelle d'Orléans",
    portraitUrl: "https://images.unsplash.com/photo-1608155686393-8fdd966d784d?auto=format&fit=crop&w=500&q=80",
    classe: "Héroïne Céleste",
    specialite1: "Ferveur Spirituelle",
    specialite2: "Inspiration des Troupes",
    realisation: "A libéré Orléans et unifié la France durant la guerre de Cent Ans à seulement 17 ans.",
    faille: "Sa foi inébranlable la guidant parfois vers des risques sacrificiels insensés.",
    citation: "Je n'ai pas peur, je suis née pour faire ceci.",
    theme: "ice",
    hp: 89,
    atk: 80
  }
];

// Galerie de portraits d'exemples triés par style
const PORTRAIT_PRESETS = [
  { name: "Spartiate", url: "https://images.unsplash.com/photo-1580130379624-3a069adbffc5?auto=format&fit=crop&w=500&q=80" },
  { name: "Guerrier Doré", url: "https://images.unsplash.com/photo-1599733589046-10c005739ef9?auto=format&fit=crop&w=500&q=80" },
  { name: "Samouraï", url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80" },
  { name: "Viking", url: "https://images.unsplash.com/photo-1608155686393-8fdd966d784d?auto=format&fit=crop&w=500&q=80" },
  { name: "Mystique", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80" },
  { name: "Paladin", url: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=500&q=80" },
  { name: "Gladiateur", url: "https://images.unsplash.com/photo-1551632640-c5bb47668952?auto=format&fit=crop&w=500&q=80" },
  { name: "Chevalier", url: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=500&q=80" }
];

const getCORSUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("cors", "true");
    return parsed.toString();
  } catch (e) {
    return url;
  }
};

const AVAILABLE_WARRIOR_TYPES = [
  "Soldat",
  "Stratège",
  "Conquérant",
  "Chef de guerre",
  "Héros mythologique",
  "Anti-héros",
  "Combattant",
  "Mercenaire"
];

const AVAILABLE_SPECIALTY_ICONS = [
  { id: 'shield', label: 'Bouclier', icon: Shield },
  { id: 'swords', label: 'Épées', icon: Swords },
  { id: 'sparkles', label: 'Magie', icon: Sparkles },
  { id: 'crown', label: 'Couronne', icon: Crown },
  { id: 'skull', label: 'Nécromancie', icon: Skull },
  { id: 'crosshair', label: 'Précision', icon: Crosshair },
  { id: 'axe', label: 'Force Brut', icon: Axe },
  { id: 'heart', label: 'Vitalité', icon: Heart },
  { id: 'eye', label: 'Sagesse', icon: Eye },
  { id: 'flame', label: 'Feu', icon: Flame },
  { id: 'zap', label: 'Foudre', icon: Zap },
  { id: 'wind', label: 'Agilité', icon: Wind },
  { id: 'target', label: 'Traque', icon: Target },
  { id: 'feather', label: 'Légèreté', icon: Feather },
  { id: 'custom', label: '✍️ Personnalisé...', icon: HelpCircle }
];

const renderSpecialtyIcon = (iconName: string | undefined, defaultIcon: string, className: string = "w-3 h-3") => {
  const name = iconName || defaultIcon;
  if (name && (name.startsWith('data:') || name.startsWith('http') || name.startsWith('blob:'))) {
    return <img src={name} className={`${className} object-contain rounded-sm select-none`} alt="specialty" referrerPolicy="no-referrer" />;
  }
  const iconObj = AVAILABLE_SPECIALTY_ICONS.find(i => i.id === name);
  if (iconObj && iconObj.id !== 'custom') {
    const IconComponent = iconObj.icon;
    return <IconComponent className={className} />;
  }
  // Si c'est personnalisé, on l'affiche directement s'il s'agit d'un emoji ou texte court
  if (name && name !== 'custom') {
    return <span className="text-[12px] sm:text-[13px] font-bold leading-none select-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{name}</span>;
  }
  // Icône par défaut
  const DefaultIcon = defaultIcon === 'sparkles' ? Sparkles : Shield;
  return <DefaultIcon className={className} />;
};

const getClassIcon = (classeName: string, iconClassName: string = "w-4 h-4") => {
  const normalized = (classeName || '').toLowerCase();
  if (normalized.includes('sorcier') || normalized.includes('mage') || normalized.includes('magicien') || normalized.includes('druide') || normalized.includes('alchimiste') || normalized.includes('wizard') || normalized.includes('philo') || normalized.includes('savant') || normalized.includes('runique')) {
    return <Sparkles className={`${iconClassName} text-amber-400 animate-pulse`} />;
  }
  if (normalized.includes('prêtre') || normalized.includes('pope') || normalized.includes('clerc') || normalized.includes('divin') || normalized.includes('céleste') || normalized.includes('ange') || normalized.includes('héroïne') || normalized.includes('paladin')) {
    return <Crown className={`${iconClassName} text-yellow-400`} />;
  }
  if (normalized.includes('assassin') || normalized.includes('voleur') || normalized.includes('ninja') || normalized.includes('ombre') || normalized.includes('mort') || normalized.includes('faucheur') || normalized.includes('démon')) {
    return <Skull className={`${iconClassName} text-purple-400`} />;
  }
  if (normalized.includes('archère') || normalized.includes('archer') || normalized.includes('chasseur') || normalized.includes('tireur') || normalized.includes('fusil') || normalized.includes('éclaireur')) {
    return <Crosshair className={`${iconClassName} text-emerald-400`} />;
  }
  if (normalized.includes('hoplite') || normalized.includes('protecteur') || normalized.includes('sentinelle') || normalized.includes('bouclier') || normalized.includes('défense') || normalized.includes('garde')) {
    return <Shield className={`${iconClassName} text-blue-400`} />;
  }
  if (normalized.includes('barbare') || normalized.includes('berserker') || normalized.includes('bourreau') || normalized.includes('colosse') || normalized.includes('brute')) {
    return <Axe className={`${iconClassName} text-red-500`} />;
  }
  // Par défaut, l'icône Swords pour les guerriers
  return <Swords className={`${iconClassName} text-amber-500 animate-pulse`} />;
};

export default function App() {
  const [cards, setCards] = useState<WarriorCard[]>(() => {
    // Essayer de charger depuis le localStorage
    const saved = localStorage.getItem('warrior_cards');
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('ALL');
  const [isExporting, setIsExporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [exportBackground, setExportBackground] = useState<'transparent' | 'filled'>('filled');

  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carte active
  const activeCard = cards[currentIndex] || cards[0] || INITIAL_CARDS[0];

  // État du formulaire synchronisé avec la carte active
  const [formData, setFormData] = useState<WarriorCard>({ ...activeCard });

  // Sauvegarder les cartes dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('warrior_cards', JSON.stringify(cards));
  }, [cards]);

  // Synchronisation lors du changement de carte active
  useEffect(() => {
    if (activeCard) {
      setFormData({ ...activeCard });
    }
  }, [currentIndex, cards]);

  // Réinitialiser les cartes à l'état initial d'usine
  const handleResetToDefault = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser l'application ? Toutes vos cartes personnalisées seront perdues et remplacées par la collection de base.")) {
      setCards(INITIAL_CARDS);
      setCurrentIndex(0);
      setFormData({ ...INITIAL_CARDS[0] });
    }
  };

  // Filtrage et recherche
  const filteredCards = cards.filter(card => {
    const matchesSearch = 
      card.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.surnom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.classe.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRarity = rarityFilter === 'ALL' || card.rarete === rarityFilter;
    
    return matchesSearch && matchesRarity;
  });

  // Gérer la sélection d'une carte dans la liste
  const handleSelectCard = (indexInFiltered: number) => {
    const cardSelected = filteredCards[indexInFiltered];
    if (cardSelected) {
      const realIndex = cards.findIndex(c => c.id === cardSelected.id);
      if (realIndex !== -1) {
        setCurrentIndex(realIndex);
      }
    }
  };

  // Gestion des modifications d'inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Mettre à jour immédiatement la liste principale pour un rendu en temps réel instantané !
      const updatedCards = [...cards];
      const activeIdx = cards.findIndex(c => c.id === prev.id);
      if (activeIdx !== -1) {
        // Conversion de type pour les nombres
        if (name === 'hp' || name === 'atk') {
          updated[name] = Math.min(100, Math.max(0, Number(value) || 0));
        }
        updatedCards[activeIdx] = updated;
        setCards(updatedCards);
      }
      return updated;
    });
  };

  // Ajout d'une nouvelle carte vierge
  const handleAddNewCard = () => {
    if (cards.length >= 100) {
      alert("Limite maximale de 100 cartes atteinte ! Veuillez supprimer des cartes obsolètes.");
      return;
    }
    
    const maxId = cards.reduce((max, c) => c.id > max ? c.id : max, 0);
    const newId = maxId + 1;
    const newCard: WarriorCard = {
      id: newId,
      numero: String(newId).padStart(3, '0'),
      nom: "NOUVEAU GUERRIER",
      rarete: "C",
      surnom: "Le Héros de l'Ombre",
      portraitUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=500&q=80",
      classe: "Guerrier / Soldat",
      specialite1: "Assaut agile",
      specialite2: "Survie extrême",
      iconSpecialite1: "shield",
      iconSpecialite2: "sparkles",
      realisation: "A accompli des exploits extraordinaires consignés dans les manuscrits sacrés.",
      faille: "Est vulnérable face aux attaques magiques ou spirituelles.",
      citation: "Dans l'obscurité, je trouve ma véritable lumière.",
      theme: "void",
      hp: 70,
      atk: 75
    };

    const newCollection = [...cards, newCard];
    setCards(newCollection);
    setCurrentIndex(newCollection.length - 1);
    setFormData(newCard);
  };

  // Dupliquer la carte active
  const handleDuplicateCard = () => {
    if (cards.length >= 100) {
      alert("Limite maximale de 100 cartes atteinte !");
      return;
    }

    const maxId = cards.reduce((max, c) => c.id > max ? c.id : max, 0);
    const newId = maxId + 1;
    const duplicated: WarriorCard = {
      ...formData,
      id: newId,
      numero: String(newId).padStart(3, '0'),
      nom: `${formData.nom} (COPIE)`
    };

    const newCollection = [...cards, duplicated];
    setCards(newCollection);
    setCurrentIndex(newCollection.length - 1);
    setFormData(duplicated);
  };

  // Supprimer la carte active
  const handleDeleteCard = () => {
    if (cards.length <= 1) {
      alert("Vous devez conserver au moins une carte dans votre studio !");
      return;
    }

    if (window.confirm(`Voulez-vous vraiment supprimer la carte de "${formData.nom}" ?`)) {
      const activeId = formData.id;
      const filtered = cards.filter(c => c.id !== activeId);
      
      setCards(filtered);
      // Sélectionner la carte précédente ou la première
      const nextIdx = Math.max(0, currentIndex - 1);
      setCurrentIndex(nextIdx);
    }
  };

  // Charger une image locale en Base64
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const base64Url = e.target.result;
        setFormData(prev => {
          const updated = { ...prev, portraitUrl: base64Url };
          const updatedCards = [...cards];
          const activeIdx = cards.findIndex(c => c.id === prev.id);
          if (activeIdx !== -1) {
            updatedCards[activeIdx] = updated;
            setCards(updatedCards);
          }
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Gestion drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  // Appliquer un portrait de la bibliothèque de presets
  const handleSelectPreset = (url: string) => {
    setFormData(prev => {
      const updated = { ...prev, portraitUrl: url };
      const updatedCards = [...cards];
      const activeIdx = cards.findIndex(c => c.id === prev.id);
      if (activeIdx !== -1) {
        updatedCards[activeIdx] = updated;
        setCards(updatedCards);
      }
      return updated;
    });
  };

  // Fonction de capture d'image via html-to-image (Génération HD)
  const exportCard = async (format: 'png' | 'jpeg') => {
    if (!cardRef.current) return;
    setIsExporting(true);
    
    try {
      // Pour une exportation sans fond, on force le fond à transparent temporairement
      const originalBg = cardRef.current.style.background;
      const originalShadow = cardRef.current.style.boxShadow;
      
      if (exportBackground === 'transparent') {
        cardRef.current.style.background = 'transparent';
        cardRef.current.style.boxShadow = 'none';
      }

      // Petite pause pour garantir que le DOM est prêt
      await new Promise(resolve => setTimeout(resolve, 150));

      const options = {
        pixelRatio: 3,           // Résolution ultra nette 3X (équivalent de scale: 3 dans html2canvas)
        cacheBust: true,         // Évite d'utiliser des images en cache qui causeraient des erreurs CORS
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      };

      let dataUrl = "";
      if (format === 'jpeg') {
        // Le format JPEG ne supporte pas la transparence, on fournit un fond par défaut sombre
        dataUrl = await toJpeg(cardRef.current, {
          ...options,
          quality: 0.95,
          backgroundColor: '#120e0a',
        });
      } else {
        dataUrl = await toPng(cardRef.current, {
          ...options,
          backgroundColor: 'transparent',
        });
      }

      // Restaurer les styles originaux
      if (exportBackground === 'transparent') {
        cardRef.current.style.background = originalBg;
        cardRef.current.style.boxShadow = originalShadow;
      }

      const fileExtension = format === 'jpeg' ? 'jpg' : 'png';

      const link = document.createElement('a');
      const safeName = formData.nom.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-');
      
      link.download = `carte-${safeName}-${formData.numero}.${fileExtension}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur d'exportation de la carte:", error);
      alert("Erreur de rendu. Si vous utilisez une URL externe d'image, assurez-vous que l'hébergeur accepte les requêtes CORS. Astuce de pro : Glissez-déposez ou uploadez un fichier image local depuis votre ordinateur pour éliminer tout blocage de sécurité !");
    } finally {
      setIsExporting(false);
    }
  };

  // Thèmes et configurations visuelles de la carte basés sur la charte gothique de feu :
  // --red: #ff0000ff;
  // --rusty-spice: #b53700ff;
  // --brandy: #871f00ff;
  // --molten-lava: #7a150eff;
  // --molten-lava-2: #76140cff;
  // --dark-garnet: #6f0000ff;
  // --dark-garnet-2: #6d0000ff;
  // --dark-garnet-3: #670000ff;
  // --black-cherry: #61000eff;
  // --espresso: #542c1eff;
  const themesConfig = {
    gold: {
      bgGradient: "from-[#542c1e] via-[#6d0000] to-[#61000e]",
      border: "border-[#871f00]/60",
      accentText: "text-[#ff0000] font-bold",
      badgeBg: "bg-[#76140c]/50 border-[#b53700]/50 text-amber-100",
      bannerGradient: "from-[#7a150e] via-[#b53700] to-[#7a150e]",
      innerBox: "from-[#542c1e] to-[#61000e]",
      glow: "shadow-[0_0_40px_rgba(135,31,0,0.25)]",
      glowingBorder: "border-[#b53700]/70 shadow-[0_0_15px_rgba(181,55,0,0.4)]",
      specBox1: "from-[#871f00]/40 to-[#7a150e]/50 border-[#b53700]/40 text-neutral-100",
      specBox2: "from-[#7a150e]/30 to-[#542c1e]/40 border-[#871f00]/30 text-neutral-300"
    },
    fire: {
      bgGradient: "from-[#6f0000] via-[#7a150e] to-[#61000e]",
      border: "border-[#ff0000]/55",
      accentText: "text-red-400 font-bold",
      badgeBg: "bg-[#670000]/60 border-[#76140c]/60 text-red-100",
      bannerGradient: "from-[#6d0000] via-[#ff0000] to-[#6d0000]",
      innerBox: "from-[#61000e] to-[#542c1e]",
      glow: "shadow-[0_0_45px_rgba(255,0,0,0.3)]",
      glowingBorder: "border-[#ff0000]/80 shadow-[0_0_20px_rgba(255,0,0,0.5)]",
      specBox1: "from-[#76140c]/50 to-[#6f0000]/60 border-[#ff0000]/50 text-neutral-100",
      specBox2: "from-[#6f0000]/40 to-[#61000e]/50 border-[#76140c]/30 text-neutral-300"
    },
    void: {
      bgGradient: "from-[#61000e] via-[#542c1e] to-[#6d0000]",
      border: "border-[#670000]/50",
      accentText: "text-[#b53700] font-bold",
      badgeBg: "bg-[#542c1e]/50 border-[#6f0000]/50 text-neutral-200",
      bannerGradient: "from-[#61000e] via-[#871f00] to-[#61000e]",
      innerBox: "from-[#542c1e] to-[#542c1e]",
      glow: "shadow-[0_0_40px_rgba(84,44,30,0.3)]",
      glowingBorder: "border-[#871f00]/60 shadow-[0_0_15px_rgba(135,31,0,0.35)]",
      specBox1: "from-[#670000]/40 to-[#61000e]/50 border-[#871f00]/40 text-neutral-100",
      specBox2: "from-[#61000e]/30 to-[#542c1e]/40 border-[#670000]/30 text-neutral-300"
    },
    ice: {
      bgGradient: "from-[#542c1e] via-[#61000e] to-[#670000]",
      border: "border-[#871f00]/50",
      accentText: "text-[#ff0000] font-bold",
      badgeBg: "bg-[#670000]/50 border-[#76140c]/50 text-rose-200",
      bannerGradient: "from-[#6d0000] via-[#871f00] to-[#6d0000]",
      innerBox: "from-[#61000e] to-[#542c1e]",
      glow: "shadow-[0_0_40px_rgba(109,0,0,0.25)]",
      glowingBorder: "border-[#871f00]/60 shadow-[0_0_15px_rgba(135,31,0,0.35)]",
      specBox1: "from-[#76140c]/40 to-[#670000]/50 border-[#871f00]/50 text-neutral-100",
      specBox2: "from-[#670000]/30 to-[#61000e]/40 border-[#76140c]/30 text-neutral-300"
    },
    emerald: {
      bgGradient: "from-[#542c1e] via-[#670000] to-[#76140c]",
      border: "border-[#b53700]/50",
      accentText: "text-[#ff0000] font-bold",
      badgeBg: "bg-[#6f0000]/40 border-[#871f00]/40 text-neutral-100",
      bannerGradient: "from-[#670000] via-[#b53700] to-[#670000]",
      innerBox: "from-[#670000] to-[#542c1e]",
      glow: "shadow-[0_0_40px_rgba(181,55,0,0.25)]",
      glowingBorder: "border-[#b53700]/65 shadow-[0_0_18px_rgba(181,55,0,0.4)]",
      specBox1: "from-[#871f00]/45 to-[#76140c]/50 border-[#b53700]/50 text-neutral-100",
      specBox2: "from-[#670000]/30 to-[#542c1e]/40 border-[#871f00]/30 text-neutral-300"
    }
  };

  const activeTheme = themesConfig[formData.theme] || themesConfig.gold;

  const rarityLabels = {
    C: { label: "Commun", color: "text-neutral-400 border-neutral-600 bg-neutral-900/80" },
    R: { label: "Rare", color: "text-blue-400 border-blue-600 bg-blue-950/50" },
    E: { label: "Épique", color: "text-purple-400 border-purple-600 bg-purple-950/50" },
    L: { label: "Légendaire", color: "text-amber-500 border-amber-600 bg-amber-950/50" },
    G: { label: "Divin", color: "text-rose-500 border-rose-600 bg-rose-950/50 animate-pulse" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c0003] via-[#0f0001] to-[#060000] text-neutral-200 font-sans p-4 sm:p-6 lg:p-8 selection:bg-[#7a150e] selection:text-neutral-100">
      
      {/* HEADER DE L'APPLICATION */}
      <header className="max-w-7xl mx-auto mb-8 border-b border-[#76140c]/30 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-transparent">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg text-neutral-950 shadow-md">
              <Swords className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-500 tracking-wider uppercase">
              Studio des 100 Guerriers
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 tracking-widest font-semibold uppercase">
            FORGE LÉGENDAIRE ET ÉDITION DE CARTES DE COMBAT
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1.5 text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-4 py-2 rounded-md font-bold transition text-amber-500/90 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            {showGuide ? "Masquer l'aide" : "Guide d'export"}
          </button>
          
          <button 
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs bg-neutral-900 hover:bg-red-950/40 hover:text-red-400 border border-neutral-800 hover:border-red-900/60 px-4 py-2 rounded-md font-bold transition cursor-pointer"
            title="Réinitialiser la collection"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>

          <div className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 shadow-inner ml-auto md:ml-0">
            <span className="text-neutral-500 uppercase tracking-widest text-[10px]">UNITÉS CRÉÉES :</span>
            <span className="text-amber-500 font-bold font-mono">{cards.length}</span>
            <span className="text-neutral-600 font-mono">/ 100</span>
          </div>
        </div>
      </header>

      {/* ZONE D'INFORMATION / AIDE CORRECTE */}
      {showGuide && (
        <div className="max-w-7xl mx-auto mb-6 bg-gradient-to-r from-amber-950/20 via-neutral-900/80 to-amber-950/10 border border-amber-600/30 p-4 rounded-xl text-xs leading-relaxed text-neutral-300 shadow-md">
          <h3 className="font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Comment obtenir le meilleur export d'image ?
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-1 text-neutral-300">
            <li>
              <strong className="text-amber-300">Zéro problème de CORS :</strong> Les images provenant d'Internet (ex. Pinterest, Unsplash non-CORS) peuvent bloquer le bouton de téléchargement en raison de restrictions de sécurité.
            </li>
            <li>
              <strong className="text-emerald-400">Solution ultime :</strong> Glissez-déposez ou cliquez sur le cadre photo pour <span className="underline">importer une image directement depuis votre appareil</span>. Elle sera stockée localement de manière sécurisée en base64, garantissant un téléchargement immédiat et sans erreur.
            </li>
            <li>
              <strong className="text-amber-300">Rendu Ultra HD :</strong> La carte est générée à une échelle de <span className="font-bold">3X sa résolution d'affichage</span> pour un rendu extrêmement net des polices et des bordures.
            </li>
          </ul>
        </div>
      )}

      {/* ZONE DE TRAVAIL PRINCIPALE */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLONNE GAUCHE (lg:col-span-7) : LISTE & FORMULAIRE DE CRÉATION */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* BARRE DE RECHERCHE, DE FILTRE & GESTION DE LISTE */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="RECHERCHER PAR NOM, CLASSE, SURNOM..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2.5 text-xs font-bold tracking-wider text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              
              <div className="flex gap-2 items-center">
                <Filter className="w-3.5 h-3.5 text-neutral-500" />
                <select
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-amber-500 font-bold focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                >
                  <option value="ALL">TOUTES RARETÉS</option>
                  <option value="C">C - COMMUN</option>
                  <option value="R">R - RARE</option>
                  <option value="E">E - ÉPIQUE</option>
                  <option value="L">L - LÉGENDAIRE</option>
                  <option value="G">G - DIVIN</option>
                </select>
              </div>
            </div>

            {/* LISTE DES CARTES CRÉÉES (BENTO CARDS HORIZONTALES) */}
            <div className="relative">
              <span className="block text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-2">
                SÉLECTIONNER PARMI LES GUERRIERS ({filteredCards.length})
              </span>
              
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-neutral-950 max-h-[110px]">
                {filteredCards.length === 0 ? (
                  <div className="w-full text-center py-4 text-xs text-neutral-500 italic bg-neutral-950/40 rounded-xl border border-neutral-800/50">
                    Aucun guerrier ne correspond à vos critères.
                  </div>
                ) : (
                  filteredCards.map((c, i) => {
                    const isSelected = activeCard.id === c.id;
                    const rType = rarityLabels[c.rarete] || rarityLabels.C;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCard(i)}
                        className={`flex-none w-[170px] bg-neutral-950 p-2.5 rounded-xl border transition-all text-left relative flex gap-2 items-center cursor-pointer ${
                          isSelected 
                            ? 'border-amber-500 bg-amber-950/10 shadow-[0_0_12px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20' 
                            : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-900 border border-neutral-800">
                          <img src={c.portraitUrl} alt="" className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 justify-between">
                            <span className="text-[10px] text-neutral-500 font-mono font-bold">#{c.numero}</span>
                            <span className={`text-[9px] font-black uppercase tracking-tight px-1 rounded border ${rType.color.split(' ')[0]} ${rType.color.split(' ')[1]}`}>
                              {c.rarete}
                            </span>
                          </div>
                          <h4 className="text-xs font-serif font-black text-neutral-200 uppercase truncate mt-0.5">
                            {c.nom}
                          </h4>
                          <p className="text-[9px] text-neutral-400 truncate italic">
                            {c.surnom}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* BOUTON RAPIDE D'AJOUT EN BAS DE LA LISTE */}
            <div className="mt-1 flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleAddNewCard}
                className="flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-black font-black uppercase tracking-tight px-5 py-2.5 rounded-md transition shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                + Nouveau Guerrier
              </button>
            </div>
          </div>

          {/* FORMULAIRE DE MODIFICATION ET CONFIGURATION */}
          <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 shadow-xl backdrop-blur-sm relative">
            <div className="absolute top-4 right-4 flex gap-1.5">
              <button
                type="button"
                onClick={handleDuplicateCard}
                className="p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-amber-500 rounded-lg transition cursor-pointer"
                title="Dupliquer ce guerrier"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleDeleteCard}
                className="p-2 bg-neutral-950 hover:bg-red-950/50 border border-neutral-800 text-neutral-500 hover:text-red-400 rounded-lg transition cursor-pointer"
                title="Supprimer ce guerrier"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-6 border-b border-neutral-800 pb-3">
              <Settings className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-serif font-bold text-neutral-200 uppercase tracking-widest">
                Caractéristiques de <span className="text-amber-500">{formData.nom || "Nouveau Guerrier"}</span>
              </h2>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              
              {/* NOM, INDEX ET RARETÉ */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest block mb-1.5">
                    Nom du Guerrier
                  </label>
                  <input 
                    type="text" 
                    name="nom" 
                    value={formData.nom} 
                    onChange={handleInputChange} 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs uppercase font-serif tracking-wider font-bold focus:border-amber-500 focus:outline-none transition-colors" 
                    required 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest block mb-1.5">
                    Rareté
                  </label>
                  <select
                    name="rarete"
                    value={formData.rarete}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs font-bold text-amber-500 focus:border-amber-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="C">C - Commun</option>
                    <option value="R">R - Rare</option>
                    <option value="E">E - Épique</option>
                    <option value="L">L - Légendaire</option>
                    <option value="G">G - Divin</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest block mb-1.5">
                    N° Index (3 Chiffres)
                  </label>
                  <input 
                    type="text" 
                    name="numero" 
                    value={formData.numero} 
                    onChange={handleInputChange} 
                    placeholder="001"
                    maxLength={3}
                    className="w-full text-center bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs font-mono font-bold text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors" 
                    required 
                  />
                </div>
              </div>

              {/* SURNOM ET THÈME VISUEL DE LA CARTE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest block mb-1.5">
                    Surnom ou Épithète du Héros
                  </label>
                  <input 
                    type="text" 
                    name="surnom" 
                    value={formData.surnom} 
                    onChange={handleInputChange} 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs italic text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors" 
                    required 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest block mb-1.5">
                    Thème Visuel (Style)
                  </label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs font-bold text-amber-500 focus:border-amber-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="gold">Or Antique</option>
                    <option value="fire">Feu d'Héphaïstos</option>
                    <option value="void">Obsidienne Abyssale</option>
                    <option value="ice">Glace Arctique</option>
                    <option value="emerald">Émeraude Mystique</option>
                  </select>
                </div>
              </div>

              {/* CONFIGURATION PORTRAIT : FICHIER OU LIEN WEB */}
              <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800/85 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    Portrait du Guerrier
                  </span>
                  <span className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider">Format : Portrait (4:5 ou 1:1)</span>
                </div>

                {/* DRAG & DROP AREA */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                    isDragOver 
                      ? 'border-amber-500 bg-amber-500/10' 
                      : 'border-neutral-850 hover:border-neutral-750 bg-neutral-900/30 hover:bg-neutral-900/50'
                  }`}
                >
                  <Upload className="w-6 h-6 text-neutral-500" />
                  <div className="text-xs">
                    <span className="text-amber-500 font-bold">Cliquez pour importer</span> ou glissez une image locale
                  </div>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider">
                    Recommandé pour éviter les restrictions CORS
                  </p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

                {/* LIEN URL ALTERNATIF */}
                <div>
                  <label className="text-[9px] font-black uppercase text-neutral-500 tracking-widest block mb-1">
                    Ou collez un lien URL d'image existant :
                  </label>
                  <input 
                    type="url" 
                    name="portraitUrl" 
                    value={formData.portraitUrl} 
                    onChange={handleInputChange} 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-blue-400 font-mono focus:border-amber-500 focus:outline-none transition-colors" 
                  />
                </div>

                {/* BIBLIOTHÈQUE DE PRESETS D'IMAGES PRÊTES À L'EMPLOI */}
                <div className="pt-2">
                  <span className="text-[9px] font-black uppercase text-neutral-500 tracking-widest block mb-2">
                    Bibliothèque de portraits thématiques :
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PORTRAIT_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(p.url)}
                        title={`Appliquer le portrait: ${p.name}`}
                        className="group relative aspect-square rounded-lg overflow-hidden border border-neutral-800 hover:border-amber-500 transition-all focus:outline-none bg-neutral-900 cursor-pointer"
                      >
                        <img src={p.url} alt="" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/45 group-hover:bg-transparent transition-all flex items-end justify-center">
                          <span className="text-[8px] font-bold text-neutral-300 group-hover:text-white truncate p-0.5 bg-black/60 w-full text-center uppercase tracking-tighter">
                            {p.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CLASSE ET CARACTÉRISTIQUES JDR (HP, ATK) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest block mb-1.5">
                    Type de Guerrier (Classe / Type)
                  </label>
                  <div className="relative">
                    <select
                      value={(() => {
                        const currentVal = formData.classe || "Guerrier / Soldat";
                        if (currentVal.startsWith("Guerrier / ")) {
                          const ext = currentVal.replace("Guerrier / ", "");
                          if (AVAILABLE_WARRIOR_TYPES.includes(ext)) {
                            return ext;
                          }
                        }
                        return "custom";
                      })()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'custom') {
                          const currentVal = formData.classe || "";
                          const currentExt = currentVal.startsWith("Guerrier / ") ? currentVal.replace("Guerrier / ", "") : currentVal;
                          setFormData(prev => ({ ...prev, classe: `Guerrier / ${currentExt || 'Personnalisé'}` }));
                        } else {
                          setFormData(prev => ({ ...prev, classe: `Guerrier / ${val}` }));
                        }
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-3 pr-8 py-2.5 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors appearance-none cursor-pointer font-medium"
                    >
                      {AVAILABLE_WARRIOR_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                      <option value="custom">✍️ Autre Type...</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-neutral-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>

                  {(() => {
                    const currentVal = formData.classe || "Guerrier / Soldat";
                    const isCustom = !currentVal.startsWith("Guerrier / ") || !AVAILABLE_WARRIOR_TYPES.includes(currentVal.replace("Guerrier / ", ""));
                    if (isCustom) {
                      const ext = currentVal.startsWith("Guerrier / ") ? currentVal.replace("Guerrier / ", "") : currentVal;
                      return (
                        <div className="mt-1.5 flex items-center gap-1.5 bg-[#8a0303]/10 border border-[#8a0303]/30 rounded-lg p-1.5">
                          <span className="text-[9px] text-neutral-400 uppercase font-black tracking-wider whitespace-nowrap">Guerrier /</span>
                          <input
                            type="text"
                            placeholder="Ex: Demi-dieu"
                            maxLength={25}
                            value={ext === 'Personnalisé' ? '' : ext}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData(prev => ({ ...prev, classe: `Guerrier / ${val || 'Personnalisé'}` }));
                            }}
                            className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">
                      Attaque (ATK)
                    </label>
                    <span className="text-[10px] font-mono font-bold text-red-500">{formData.atk} / 100</span>
                  </div>
                  <input 
                    type="range" 
                    name="atk" 
                    min="0" 
                    max="100"
                    value={formData.atk} 
                    onChange={handleInputChange} 
                    className="w-full accent-red-600 cursor-pointer h-1.5 bg-neutral-950 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">
                      Santé (HP)
                    </label>
                    <span className="text-[10px] font-mono font-bold text-emerald-500">{formData.hp} / 100</span>
                  </div>
                  <input 
                    type="range" 
                    name="hp" 
                    min="0" 
                    max="100"
                    value={formData.hp} 
                    onChange={handleInputChange} 
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-neutral-950 rounded-lg"
                  />
                </div>
              </div>

              {/* DEUX SPÉCIALITÉS CÔTE À CÔTE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest block mb-1.5">
                    Spécialité Primaire (Bouton gauche)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="specialite1" 
                      value={formData.specialite1} 
                      onChange={handleInputChange} 
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors" 
                      required 
                    />
                    <div className="relative flex-shrink-0 w-28">
                      <select
                        name="iconSpecialite1"
                        value={AVAILABLE_SPECIALTY_ICONS.some(item => item.id === formData.iconSpecialite1 && item.id !== 'custom') ? (formData.iconSpecialite1 || 'shield') : 'custom'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'custom') {
                            setFormData(prev => ({ ...prev, iconSpecialite1: '⭐' }));
                          } else {
                            setFormData(prev => ({ ...prev, iconSpecialite1: val }));
                          }
                        }}
                        className="w-full h-full bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-2 py-2 text-xs text-neutral-300 focus:border-amber-500 focus:outline-none transition-colors appearance-none cursor-pointer font-medium"
                      >
                        {AVAILABLE_SPECIALTY_ICONS.map(item => (
                          <option key={item.id} value={item.id} className="bg-neutral-950 text-neutral-300">
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500">
                        {renderSpecialtyIcon(formData.iconSpecialite1, 'shield', 'w-4 h-4')}
                      </div>
                    </div>
                  </div>
                  {!AVAILABLE_SPECIALTY_ICONS.some(item => item.id === formData.iconSpecialite1 && item.id !== 'custom') && (
                    <div className="mt-1.5 flex flex-col gap-1.5 bg-amber-950/20 border border-amber-600/30 rounded-lg p-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-neutral-400 uppercase font-black tracking-wider whitespace-nowrap">Emoji/Texte :</span>
                        <input
                          type="text"
                          placeholder="Ex: 🐉"
                          maxLength={6}
                          value={(!formData.iconSpecialite1?.startsWith('data:') && formData.iconSpecialite1 !== 'custom') ? formData.iconSpecialite1 : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({ ...prev, iconSpecialite1: val || 'custom' }));
                          }}
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-neutral-400 uppercase font-black tracking-wider whitespace-nowrap">Téléverser :</span>
                        <label className="flex-1 flex items-center justify-center gap-1.5 bg-neutral-905 border border-neutral-800 hover:border-amber-500 rounded px-2 py-1 text-[10px] text-neutral-300 hover:text-white cursor-pointer transition-colors">
                          <Upload className="w-3 h-3 text-amber-500" />
                          <span className="truncate">{formData.iconSpecialite1?.startsWith('data:') ? 'Icône chargée ✓' : 'Choisir image...'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result && typeof ev.target.result === 'string') {
                                    setFormData(prev => ({ ...prev, iconSpecialite1: ev.target!.result as string }));
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest block mb-1.5">
                    Spécialité Secondaire (Bouton droit)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="specialite2" 
                      value={formData.specialite2} 
                      onChange={handleInputChange} 
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors" 
                      required 
                    />
                    <div className="relative flex-shrink-0 w-28">
                      <select
                        name="iconSpecialite2"
                        value={AVAILABLE_SPECIALTY_ICONS.some(item => item.id === formData.iconSpecialite2 && item.id !== 'custom') ? (formData.iconSpecialite2 || 'sparkles') : 'custom'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'custom') {
                            setFormData(prev => ({ ...prev, iconSpecialite2: '🔥' }));
                          } else {
                            setFormData(prev => ({ ...prev, iconSpecialite2: val }));
                          }
                        }}
                        className="w-full h-full bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-2 py-2 text-xs text-neutral-300 focus:border-amber-500 focus:outline-none transition-colors appearance-none cursor-pointer font-medium"
                      >
                        {AVAILABLE_SPECIALTY_ICONS.map(item => (
                          <option key={item.id} value={item.id} className="bg-neutral-950 text-neutral-300">
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-rose-400">
                        {renderSpecialtyIcon(formData.iconSpecialite2, 'sparkles', 'w-4 h-4')}
                      </div>
                    </div>
                  </div>
                  {!AVAILABLE_SPECIALTY_ICONS.some(item => item.id === formData.iconSpecialite2 && item.id !== 'custom') && (
                    <div className="mt-1.5 flex flex-col gap-1.5 bg-rose-950/20 border border-rose-600/30 rounded-lg p-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-neutral-400 uppercase font-black tracking-wider whitespace-nowrap">Emoji/Texte :</span>
                        <input
                          type="text"
                          placeholder="Ex: 💀"
                          maxLength={6}
                          value={(!formData.iconSpecialite2?.startsWith('data:') && formData.iconSpecialite2 !== 'custom') ? formData.iconSpecialite2 : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({ ...prev, iconSpecialite2: val || 'custom' }));
                          }}
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-neutral-400 uppercase font-black tracking-wider whitespace-nowrap">Téléverser :</span>
                        <label className="flex-1 flex items-center justify-center gap-1.5 bg-neutral-905 border border-neutral-800 hover:border-amber-500 rounded px-2 py-1 text-[10px] text-neutral-300 hover:text-white cursor-pointer transition-colors">
                          <Upload className="w-3 h-3 text-rose-400" />
                          <span className="truncate">{formData.iconSpecialite2?.startsWith('data:') ? 'Icône chargée ✓' : 'Choisir image...'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result && typeof ev.target.result === 'string') {
                                    setFormData(prev => ({ ...prev, iconSpecialite2: ev.target!.result as string }));
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RÉALISATION CLEF */}
              <div>
                <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest block mb-1.5">
                  Réalisation Majeure / Fait d'Armes (1 phrase courte)
                </label>
                <textarea 
                  name="realisation" 
                  value={formData.realisation} 
                  onChange={handleInputChange} 
                  rows={2} 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none resize-none transition-colors h-16 leading-relaxed" 
                  maxLength={150}
                  required 
                />
              </div>

              {/* FAILLE CRITIQUE */}
              <div>
                <label className="text-[10px] font-black uppercase text-red-500/90 tracking-widest block mb-1.5">
                  Faille Critique ou Vulnérabilité (1 phrase courte)
                </label>
                <textarea 
                  name="faille" 
                  value={formData.faille} 
                  onChange={handleInputChange} 
                  rows={2} 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none resize-none transition-colors h-16 leading-relaxed" 
                  maxLength={150}
                  required 
                />
              </div>

              {/* CITATION DU HÉROS */}
              <div>
                <label className="text-[10px] font-black uppercase text-amber-500/80 tracking-widest block mb-1.5 flex justify-between">
                  <span>« Citation de combat du Héros »</span>
                  <span className="text-[9px] text-neutral-500 italic lowercase font-normal">Saisie multiligne</span>
                </label>
                <textarea 
                  name="citation" 
                  value={formData.citation} 
                  onChange={handleInputChange} 
                  rows={3}
                  maxLength={180}
                  placeholder="Saisissez une citation marquante de votre guerrier..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs italic text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors scrollbar-thin leading-relaxed" 
                  required 
                />
              </div>

              <div className="pt-2">
                <div className="p-3.5 bg-amber-500/5 rounded-lg border border-amber-600/20 text-[10px] text-amber-500/80 italic font-medium uppercase tracking-wider text-center">
                  💡 Sauvegarde locale active en temps réel.
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* COLONNE DROITE (lg:col-span-5) : APERÇU FIDÈLE EN DIRECT & EXPORTATION */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          
          {/* OPTIONS ET BOUTONS DE TÉLÉCHARGEMENT */}
          <div className="bg-neutral-900/40 p-5 rounded-2xl border border-neutral-800 shadow-lg backdrop-blur-sm w-full max-w-[430px] mb-6 space-y-4">
            <span className="block text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">
              Options d'exportation d'image
            </span>

            {/* TOGGLE FOND D'EXPORT */}
            <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
              <button
                type="button"
                onClick={() => setExportBackground('filled')}
                className={`py-1.5 px-3 rounded-md text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  exportBackground === 'filled' 
                    ? 'bg-amber-600 text-black shadow' 
                    : 'text-neutral-500 hover:text-neutral-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> FOND SOMBRE
              </button>
              <button
                type="button"
                onClick={() => setExportBackground('transparent')}
                className={`py-1.5 px-3 rounded-md text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  exportBackground === 'transparent' 
                    ? 'bg-amber-600 text-black shadow' 
                    : 'text-neutral-500 hover:text-neutral-200'
                }`}
                title="Génère la carte avec un fond transparent tout autour"
              >
                <FileImage className="w-3.5 h-3.5" /> SANS FOND (PNG)
              </button>
            </div>

            {/* BOUTONS EXPORT PNG / JPEG */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => exportCard('png')} 
                disabled={isExporting}
                className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500 rounded-lg text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer text-neutral-200"
              >
                <Download className="w-3.5 h-3.5 text-amber-500" /> 
                {isExporting ? "RENDU..." : "TÉLÉCHARGER PNG"}
              </button>
              <button 
                onClick={() => exportCard('jpeg')} 
                disabled={isExporting}
                className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500 rounded-lg text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer text-neutral-200"
              >
                <Download className="w-3.5 h-3.5 text-amber-500" /> 
                {isExporting ? "RENDU..." : "TÉLÉCHARGER JPEG"}
              </button>
            </div>
          </div>

          {/* RENDU DE LA CARTE TRADING CARD GAME (Cible de capture via la Ref) */}
          <div className="relative">
            <div 
              ref={cardRef}
              id="warrior-card-container"
              className="relative w-[360px] sm:w-[430px] h-[580px] sm:h-[670px] bg-[#0c0a09] rounded-[24px] p-[10px] sm:p-[12px] transition-all duration-300 overflow-hidden flex flex-col justify-between border-[5px] sm:border-[6px] border-[#ff0000] neon-blood-border"
            >
              {/* IMAGE DE FOND ÉPIQUE/GOTHIQUE GÉNÉRALE (Image uploadée enrichie) */}
              <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img 
                  src={cardBackground} 
                  alt="Epic Gothic Background" 
                  className="w-full h-full object-cover brightness-[0.7] contrast-[1.1] saturate-[0.85] transition-all duration-300"
                />
                {/* Calque d'incrustation de couleur dynamique basé sur le thème actif */}
                <div className={`absolute inset-0 bg-gradient-to-b ${activeTheme.bgGradient} mix-blend-color opacity-85 transition-all duration-300`} />
                {/* Vignettage et ombrage dramatique pour garantir la lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/70" />
                {/* Texture de grain d'impression vintage de carte */}
                <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>

              {/* Texture d'armure métallique brossée */}
              <div className="absolute inset-0 brushed-metal pointer-events-none opacity-20 z-10" />

              {/* Effet d'explosion et de feu de fond (Pulsation discrète) */}
              <div className="explosion-glow" />

              {/* Rivets d'armure lourde en acier aux angles du cadre extérieur */}
              <div className="armor-rivet top-3.5 left-3.5" />
              <div className="armor-rivet top-3.5 right-3.5" />
              <div className="armor-rivet bottom-3.5 left-3.5" />
              <div className="armor-rivet bottom-3.5 right-3.5" />
              <div className="armor-rivet top-1/2 -translate-y-1/2 left-3.5" />
              <div className="armor-rivet top-1/2 -translate-y-1/2 right-3.5" />

              {/* Balafres d'acier de combat (Traces d'épée plus courtes et plus subtiles) */}
              <div className="metal-scratch top-[18%] left-[15%] w-[45%] rotate-[20deg] opacity-35" />
              <div className="metal-scratch top-[32%] left-[25%] w-[35%] rotate-[-25deg] opacity-30" />
              <div className="metal-scratch top-[52%] left-[18%] w-[50%] rotate-[-8deg] opacity-40" />
              <div className="metal-scratch top-[75%] left-[20%] w-[55%] rotate-[10deg] opacity-35" />

              {/* Effets de sparkle de feu discret en dessus des textes (z-25) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[24px] z-25">
                {[...Array(10)].map((_, i) => {
                  const size = Math.random() * 2.5 + 1.5; // 1.5px à 4px
                  const left = Math.random() * 100;
                  const duration = Math.random() * 2 + 3; // 3s à 5s
                  const delay = Math.random() * -5;
                  const drift = Math.random() * 24 - 12;
                  return (
                    <div
                      key={i}
                      className="fire-sparkle"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${left}%`,
                        bottom: `-10px`,
                        '--duration': `${duration}s`,
                        '--drift': `${drift}px`,
                        animationDelay: `${delay}s`,
                        filter: 'blur(0.4px) drop-shadow(0 0 2px #f97316)',
                        opacity: 0.65
                      } as React.CSSProperties}
                    />
                  );
                })}
              </div>

              {/* Coulures de sang qui coulent depuis le portrait (Sous les textes grâce à un z-index bas) */}
              <div className="absolute top-[285px] left-[24px] w-[3px] h-14 bg-gradient-to-b from-[#ff0000] to-transparent opacity-85 z-[1] pointer-events-none rounded-full" />
              <div className="absolute top-[295px] left-[24px] w-[5px] h-[5px] bg-[#ff0000] rounded-full z-[1] pointer-events-none shadow-[0_0_8px_#ff0000]" />
              
              <div className="absolute top-[280px] right-[32px] w-[2px] h-10 bg-gradient-to-b from-[#6f0000] to-transparent opacity-75 z-[1] pointer-events-none rounded-full" />

              {/* Éclaboussure de sang en bas à gauche (Sous les boîtes grâce à z-[1]) */}
              <div className="absolute bottom-[20px] left-[20px] w-16 h-16 pointer-events-none z-[1] opacity-60 text-[#6f0000]">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M40,50 C45,42 55,45 60,38 C65,31 58,22 68,18 C78,14 82,25 80,35 C78,45 88,48 84,58 C80,68 70,62 62,72 C54,82 42,78 35,70 C28,62 32,58 40,50 Z" />
                  <circle cx="20" cy="40" r="2" />
                  <circle cx="50" cy="85" r="1.5" />
                </svg>
              </div>

              {/* Cadre de bordure métallique d'angle */}
              <div className={`absolute inset-[4px] sm:inset-[5px] border-[2px] rounded-[20px] pointer-events-none transition-colors duration-300 z-20 ${activeTheme.glowingBorder}`} />
              
              {/* Double liseré interne élégant */}
              <div className="absolute inset-[8px] sm:inset-[10px] border border-white/5 rounded-[16px] pointer-events-none z-20" />
              
              {/* Ornements d'angle médiévaux raffinés */}
              <div className={`absolute top-[10px] left-[10px] sm:top-[12px] sm:left-[12px] w-4 h-4 border-t border-l ${activeTheme.border.split(' ')[0]} z-20 opacity-80`} />
              <div className={`absolute top-[10px] right-[10px] sm:top-[12px] sm:right-[12px] w-4 h-4 border-t border-r ${activeTheme.border.split(' ')[0]} z-20 opacity-80`} />
              <div className={`absolute bottom-[10px] left-[10px] sm:bottom-[12px] sm:left-[12px] w-4 h-4 border-b border-l ${activeTheme.border.split(' ')[0]} z-20 opacity-80`} />
              <div className={`absolute bottom-[10px] right-[10px] sm:bottom-[12px] sm:right-[12px] w-4 h-4 border-b border-r ${activeTheme.border.split(' ')[0]} z-20 opacity-80`} />

              {/* Contenu principal de la carte */}
              <div className="w-full h-full flex flex-col justify-between relative z-10">
                
                {/* EN-TÊTE : SECTION DU NOM AVEC BORDURE OR AMÉLIORÉE */}
                <div className="p-1.5 sm:p-2 pb-1.5 flex flex-col relative bg-black/85 backdrop-blur-[12px] border-2 border-amber-500/80 rounded-xl mx-2 mt-2 shadow-[0_0_12px_rgba(212,175,55,0.2),inset_0_1px_2.5px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,0,0,0.85)] overflow-hidden">
                  
                  {/* Ornements d'angle gothiques dorés raffinés */}
                  <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-amber-400/80 pointer-events-none" />
                  <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-amber-400/80 pointer-events-none" />
                  <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-amber-400/80 pointer-events-none" />
                  <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-amber-400/80 pointer-events-none" />

                  {/* Tache de sang d'arrière-plan très discrète sous les textes */}
                  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-25 select-none">
                    <div className="absolute -bottom-2 -left-2 w-14 h-14 text-[#8a0303]/30">
                      <svg viewBox="0 0 100 100" fill="currentColor">
                        <path d="M30,50 C40,40 60,45 50,70 C40,80 20,70 30,50 Z" />
                      </svg>
                    </div>
                  </div>

                  {/* Tache de sang discrète cachée DERRIÈRE l'icône et le numéro */}
                  <div className="absolute top-[-5px] right-[-5px] w-16 h-16 pointer-events-none z-0 opacity-30 text-[#8a0303]">
                    <svg viewBox="0 0 100 100" fill="currentColor">
                      <path d="M50,30 C55,20 62,15 70,25 C75,32 68,40 75,48 C80,55 90,52 88,65 C85,75 75,70 65,82 C55,90 45,95 35,88 C25,80 32,70 25,62 C18,55 8,58 10,48 C12,38 25,45 32,35 C38,25 45,40 50,30 Z" />
                    </svg>
                  </div>

                  <div className="flex justify-between items-center gap-2 relative z-10 w-full">
                    <div className="min-w-0 flex-1 pl-1">
                      <h2 className="text-xl sm:text-2xl font-black tracking-wider text-neutral-100 uppercase font-serif truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        {formData.nom || "SANS NOM"}
                      </h2>
                      <p className={`text-[8px] sm:text-[9px] font-bold ${activeTheme.accentText} italic tracking-wider mt-0.5 font-serif truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}>
                        {formData.surnom || "Le Héros Mystique"}
                      </p>
                    </div>
                    
                    {/* EN-TÊTE DROIT : ICÔNE DE CLASSE ET INDEX */}
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0 relative z-10 pr-0.5">
                      <div className="bg-gradient-to-b from-[#1a1512] via-[#2d221a] to-[#120e0b] border-[2px] border-amber-500/80 p-1 sm:p-1.5 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.45),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:scale-110 transition-transform relative before:absolute before:inset-[1px] before:border before:border-white/5 before:rounded-full" title={`Classe: ${formData.classe}`}>
                        {getClassIcon(formData.classe, "w-4.5 h-4.5 sm:w-5.5 h-5.5 relative z-10")}
                      </div>
                      <span className="text-[6.5px] sm:text-[7.5px] text-neutral-400 font-mono tracking-widest bg-black/85 px-1 py-0.5 rounded border border-white/5 mt-0.5">
                        N° {formData.numero}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CHAMP 3 : PORTRAIT DÉFINI PAR L'URL (Avec filtres et effets de sang discrets) */}
                <div className="mx-2 relative flex-1 min-h-[220px] sm:min-h-[270px] rounded-xl overflow-hidden border-2 border-[#ff0000]/60 shadow-[0_0_12px_rgba(255,0,0,0.35),inset_0_0_10px_rgba(138,3,3,0.5)] mt-1.5 bg-[#120101]">
                  {/* Filtres rouge sang discrets et vignettes sur le portrait */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#7a0303]/40 via-transparent to-[#7a0303]/20 mix-blend-overlay z-10 pointer-events-none" />
                  <div className="absolute inset-0 bg-[#ff0000]/10 mix-blend-color z-10 pointer-events-none" />
                  
                  {/* Coulures de sang discrètes sur le portrait */}
                  <div className="absolute top-0 left-[25%] w-[1.5px] h-8 bg-gradient-to-b from-[#8a0303]/80 to-transparent z-10 pointer-events-none" />
                  <div className="absolute top-0 left-[25%] w-1 h-1 bg-[#8a0303] rounded-full z-10 pointer-events-none shadow-[0_0_4px_rgba(255,0,0,0.8)]" />
                  <div className="absolute top-0 right-[30%] w-[1px] h-5 bg-gradient-to-b from-[#8a0303]/70 to-transparent z-10 pointer-events-none" />
                  <div className="absolute top-0 right-[30%] w-2.5 h-2.5 bg-[#8a0303]/90 rounded-full z-10 pointer-events-none" />

                  {/* Éclaboussures de sang décoratives sur le portrait */}
                  <div className="absolute top-2 left-3 text-[#ff0000]/35 z-10 pointer-events-none">
                    <svg className="w-10 h-10" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M10,10 C25,25 35,20 28,45 C22,55 18,35 8,60 C4,70 14,75 20,65 C26,55 32,80 42,70 C52,60 40,40 37,30 C34,20 27,10 10,10 Z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-2 right-3 text-[#8a0303]/45 z-10 pointer-events-none">
                    <svg className="w-14 h-7" viewBox="0 0 100 50" fill="currentColor">
                      <path d="M5,45 C15,35 30,48 45,35 C60,22 55,5 75,10 C95,15 85,38 95,45 C80,48 65,42 50,48 C35,48 20,40 5,45 Z" />
                    </svg>
                  </div>

                  {formData.portraitUrl ? (
                    <img 
                       src={getCORSUrl(formData.portraitUrl)} 
                      alt={formData.nom} 
                      className="w-full h-full object-cover object-top transition-all duration-500 hover:scale-105"
                      crossOrigin="anonymous" // Requis par html2canvas
                    />
                  ) : (
                    <div className="w-full h-full bg-[#120101] flex flex-col items-center justify-center gap-2 text-neutral-500">
                      <ImageIcon className="w-10 h-10 stroke-1 text-[#ff0000]/60" />
                      <span className="text-xs text-neutral-400">Aucun portrait sélectionné</span>
                    </div>
                  )}
                </div>

                {/* CHAMP 4 : CLASSE ET SOUS-TYPE (Plaque d'acier brossée rivetée avec texture métallique) */}
                <div className="px-4 text-center mt-0.5 mb-1">
                  <span className="inline-block text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] font-black px-4 py-1 rounded-lg border-2 border-[#8a0303]/80 shadow-[inset_0_1px_3px_rgba(255,255,255,0.25),0_0_10px_rgba(138,3,3,0.4),0_3px_6px_rgba(0,0,0,0.6)] bg-gradient-to-r from-[#171413] via-[#2a2420] to-[#171413] text-[#f5f5f4] backdrop-blur-md relative overflow-hidden">
                    {/* Texture brossée d'acier médiéval */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:4px_4px] opacity-15 pointer-events-none" />
                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff0000] animate-pulse shadow-[0_0_4px_#ef4444]" />
                      {formData.classe || "GUERRIER / SOLDAT"}
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff0000] animate-pulse shadow-[0_0_4px_#ef4444]" />
                    </span>
                  </span>
                </div>

                {/* CHAMP 5 : LES DEUX SPÉCIALITÉS CÔTE À CÔTE (Glassmorphismes teintés avec bordures métalliques épaisses) */}
                <div className="grid grid-cols-2 gap-2 px-2 sm:px-3 mt-1">
                  <div className="bg-black/75 backdrop-blur-[4px] border-2 border-neutral-500/60 rounded-lg py-1 px-2 flex items-center justify-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.5)]">
                    <span className="text-amber-500 flex-shrink-0">
                      {renderSpecialtyIcon(formData.iconSpecialite1, 'shield', 'w-3.5 h-3.5')}
                    </span>
                    <span className="text-[8px] sm:text-[9.5px] font-black tracking-wide uppercase truncate text-neutral-100">
                      {formData.specialite1 || "SPÉCIALITÉ 1"}
                    </span>
                  </div>

                  <div className="bg-black/55 backdrop-blur-[2px] border-2 border-neutral-500/50 rounded-lg py-1 px-2 flex items-center justify-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_1.5px_3px_rgba(0,0,0,0.4)]">
                    <span className="text-rose-400 flex-shrink-0">
                      {renderSpecialtyIcon(formData.iconSpecialite2, 'sparkles', 'w-3.5 h-3.5')}
                    </span>
                    <span className="text-[8px] sm:text-[9.5px] font-black tracking-wide uppercase truncate text-neutral-300">
                      {formData.specialite2 || "SPÉCIALITÉ 2"}
                    </span>
                  </div>
                </div>

                {/* CONTENEUR TEXTUEL SUR FOND EN PHOTO GRAVÉE (Bordure métallique rivetée or/acier) */}
                <div 
                  className="m-2 p-2 sm:p-2.5 border-2 border-amber-600/75 rounded-xl flex flex-col gap-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.85),0_4px_6px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[#241a0d]"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(212, 175, 55, 0.45), rgba(101, 67, 33, 0.9)), url(${cardBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'multiply',
                  }}
                >
                  
                  {/* Effet étincelles de feu (Fire sparkles / embers floating up) */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl z-0">
                    {[...Array(12)].map((_, i) => {
                      const size = Math.random() * 4 + 2; // 2px à 6px
                      const left = Math.random() * 100;   // 0% à 100%
                      const duration = Math.random() * 3 + 3; // 3s à 6s
                      const delay = Math.random() * -6;   // Délai négatif pour démarrer immédiatement
                      const drift = Math.random() * 40 - 20; // -20px à 20px
                      return (
                        <div
                          key={i}
                          className="fire-ember"
                          style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            left: `${left}%`,
                            bottom: `-10px`,
                            '--ember-duration': `${duration}s`,
                            '--ember-drift': `${drift}px`,
                            animationDelay: `${delay}s`,
                            filter: 'blur(0.5px) drop-shadow(0 0 3px #ff0000)',
                          } as React.CSSProperties}
                        />
                      );
                    })}
                  </div>

                  {/* Taches de sang d'arrière-plan très discrètes pour les textes (z-0) */}
                  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-25 select-none">
                    <div className="absolute top-[20%] left-[25%] w-20 h-20 text-[#8a0303]/25 blur-[1px]">
                      <svg viewBox="0 0 100 100" fill="currentColor">
                        <path d="M50,30 C65,20 80,35 70,55 C60,75 40,70 35,55 C30,40 40,35 50,30 Z" />
                      </svg>
                    </div>
                    <div className="absolute bottom-[15%] right-[15%] w-16 h-16 text-[#8a0303]/20 blur-[1.5px]">
                      <svg viewBox="0 0 100 100" fill="currentColor">
                        <path d="M20,40 C40,30 50,50 40,70 C30,80 10,60 20,40 Z" />
                      </svg>
                    </div>
                  </div>

                  {/* CHAMP 6 : RÉALISATION CLEF */}
                  <div className="relative z-10">
                    <h4 className="text-[7.5px] sm:text-[8px] font-black tracking-widest text-[#f59e0b] drop-shadow-[0_0_3px_rgba(245,158,11,0.6)] uppercase mb-0.5 opacity-100 font-serif">
                      RÉALISATION CLEF
                    </h4>
                    <p className="text-[9.5px] sm:text-[10.5px] text-neutral-200 leading-tight font-sans font-semibold line-clamp-2">
                      {formData.realisation || "Aucun fait d'armes connu n'a été répertorié pour ce guerrier."}
                    </p>
                  </div>

                  <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-600/20 to-transparent relative z-10" />

                  {/* CHAMP 7 : FAILLE */}
                  <div className="relative z-10">
                    <h4 className="text-[7.5px] sm:text-[8px] font-black tracking-widest text-[#ff0000] uppercase mb-0.5 opacity-100 font-serif">
                      FAILLE CRITIQUE
                    </h4>
                    <p className="text-[9.5px] sm:text-[10.5px] text-neutral-300 leading-tight font-sans font-medium line-clamp-2">
                      {formData.faille || "Sa faille reste mystérieuse et indéterminée."}
                    </p>
                  </div>

                  <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-600/20 to-transparent relative z-10" />

                  {/* CHAMP 8 : CITATION */}
                  <div className="pt-1.5 pb-1 text-center flex items-center justify-start gap-2 px-2.5 relative z-10 bg-black/45 rounded-lg border border-[#8a0303]/30 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6),0_0_8px_rgba(138,3,3,0.15)]">
                    <Quote className="w-4.5 h-4.5 sm:w-5.5 h-5.5 text-amber-400 drop-shadow-[0_0_6px_#f59e0b] flex-shrink-0 animate-pulse" />
                    <p className="text-[9.5px] sm:text-[11px] italic text-rose-100/95 font-playfair tracking-wide leading-relaxed whitespace-normal text-left w-full max-h-[50px] overflow-y-auto pr-0.5 scrollbar-thin">
                      {formData.citation || "Saisissez votre citation épique..."}
                    </p>
                  </div>

                </div>
              </div>
            </div>
            
            {/* AMBIENT SHADOW / REFLECTION HIGHLIGHTS (uniquement à des fins esthétiques sur l'interface) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none rounded-[28px] ring-1 ring-white/10 shadow-[inset_0_2px_3px_rgba(255,255,255,0.05)] z-20" />
          </div>

          <p className="text-[10px] text-neutral-500 text-center mt-3 font-medium">
            Aperçu HD fidèle à l'exportation. Utilisez l'image générée dans vos jeux de rôle ou d'aventure.
          </p>
        </div>

      </div>

      {/* FOOTER DE L'APPLICATION */}
      <footer className="max-w-7xl mx-auto mt-16 border-t border-neutral-900 pt-6 text-center text-xs text-neutral-500 pb-8 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="font-medium">
          © 2026 Studio des 100 Guerriers • Réalisé de manière artisanale
        </p>
        <div className="flex gap-4 font-bold text-neutral-400">
          <span className="hover:text-amber-500 transition cursor-default">Jeu de Rôle</span>
          <span>•</span>
          <span className="hover:text-amber-500 transition cursor-default">Éditeur HD</span>
          <span>•</span>
          <span className="hover:text-amber-500 transition cursor-default">Local Persistence</span>
        </div>
      </footer>
    </div>
  );
}
