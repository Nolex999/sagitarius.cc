import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'components', 'dashboard', 'bio', 'BioEditor.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = {
  "'Profil'": "'Profile'",
  "'Thème'": "'Theme'",
  "'Effets'": "'Effects'",
  "'Liens'": "'Links'",
  "'Musique'": "'Music'",
  "label: 'Profil'": "label: 'Profile'",
  "label: 'Thème'": "label: 'Theme'",
  "label: 'Effets'": "label: 'Effects'",
  "label: 'Liens'": "label: 'Links'",
  "label: 'Musique'": "label: 'Music'",
  "Identité": "Identity",
  "Nom d'affichage": "Display Name",
  "Ton nom": "Your name",
  "Décris-toi en quelques mots...": "Describe yourself in a few words...",
  "Forme de l'avatar": "Avatar Shape",
  "Rond": "Circle",
  "Carré": "Square",
  "Hexagone": "Hexagon",
  "Hauteur du banner": "Banner Height",
  "Afficher un status": "Show status",
  "Texte du status": "Status text",
  "Couleur du status": "Status color",
  "Langue": "Language",
  "Tag de langue": "Language tag",
  "Badge custom": "Custom badge",
  "Nom du badge": "Badge name",
  "Ajouter un réseau": "Add a social link",
  "Ajouter un lien": "Add link",
  "Preset de layout": "Layout preset",
  "Style de page": "Page style",
  "Centré": "Centered",
  "Gauche": "Left-aligned",
  "Carte": "Card",
  "Bordure du profil": "Profile Border",
  "Style de bordure": "Border Style",
  "Aucune": "None",
  "Solide": "Solid",
  "Animée": "Animated",
  "Tirets": "Dashed",
  "Activer le glassmorphism": "Enable glassmorphism",
  "Flou": "Blur",
  "Opacité": "Opacity",
  "Overlay de fond": "Background overlay",
  "Activer l'overlay": "Enable overlay",
  "Couleur de l'overlay": "Overlay color",
  "Couleurs": "Colors",
  "Couleur principale": "Primary color",
  "Couleur secondaire": "Secondary color",
  "Couleur accent": "Accent color",
  "Couleur BG 1": "BG Color 1",
  "Couleur BG 2": "BG Color 2",
  "URL de l'image": "Image URL",
  "Police": "Font",
  "Style des cartes": "Card style",
  "Néon": "Neon",
  "Activer le glow": "Enable glow",
  "Couleur du glow": "Glow color",
  "Intensité": "Intensity",
  "Étoiles": "Stars",
  "Pluie": "Rain",
  "Neige": "Snow",
  "Lucioles": "Fireflies",
  "Type de trail": "Trail type",
  "Aucun": "None",
  "Couleur du trail": "Trail color",
  "Type d'effet": "Effect type",
  "Animation d'entrée": "Entrance Animation",
  "Effet au clic": "Click effect",
  "Curseur": "Cursor",
  "Style du curseur": "Cursor style",
  "Défaut": "Default",
  "Croix": "Crosshair",
  "Pointeur": "Pointer",
  "Lecteur de musique": "Music Player",
  "Activer la musique": "Enable music",
  "Affichage": "Display",
  "Afficher les vues": "Show views",
  "Afficher la date d'inscription": "Show join date",
  "Stats Custom": "Custom Stats",
  "Valeur": "Value",
  "Ajouter une stat": "Add stat",
  "Activer la timeline": "Enable timeline",
  "Date (ex: Mars 2026)": "Date (e.g., March 2026)",
  "Titre": "Title",
  "Ajouter un événement": "Add event",
  "Galerie d'images": "Image Gallery",
  "Activer la galerie": "Enable gallery",
  "Légende": "Caption",
  "Ajouter une image": "Add image",
  "Vidéo embed": "Embed Video",
  "Embed une vidéo": "Embed a video",
  "Personnalise comment ta page apparaît sur Google, Discord, Twitter et autres plateformes.": "Customize how your page appears on Google, Discord, Twitter, and other platforms.",
  "Titre personnalisé": "Custom title",
  "Ma bio page personnalisée...": "My custom bio page...",
  "Ajoute du CSS custom pour personnaliser ta page encore plus. Utilise": "Add custom CSS to customize your page even more. Use",
  "Ton CSS ici": "Your CSS here",
  "Customise ta page": "Customize your page",
  "Image banner URL": "Banner image URL",
  "Couleur de l'effet": "Effect color",
  "Bio en typewriter": "Typewriter bio",
  "Réseaux Sociaux": "Social Networks",
  "Liens Custom": "Custom Links",
  "Titre du lien": "Link title",
  "sélecteur racine.": "root selector.",
  "Mon profil — Sagitarius.cc": "My profile — Sagitarius.cc",
  "URL YouTube / autre": "YouTube / other URL"
};

for (const [fr, en] of Object.entries(replacements)) {
  const re = new RegExp(fr, 'g');
  content = content.replace(re, en);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Translated BioEditor.tsx');

const layoutPath = path.join(__dirname, 'src', 'app', 'layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace(/lang="fr"/g, 'lang="en"');
fs.writeFileSync(layoutPath, layoutContent, 'utf8');
console.log('Updated layout.tsx lang to en');
