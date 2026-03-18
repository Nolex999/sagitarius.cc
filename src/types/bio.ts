export type BgType = 'solid' | 'gradient' | 'image' | 'video' | 'pattern';
export type CardStyle = 'glass' | 'solid' | 'outline' | 'neon';
export type BgEffect = 'none' | 'particles' | 'matrix' | 'stars' | 'rain' | 'snow' | 'fireflies';
export type CursorTrail = 'none' | 'glow' | 'sparkle' | 'trail' | 'fire';
export type AvatarEffect = 'none' | 'glow-pulse' | 'rotate-border' | 'glitch' | 'breathe' | 'float' | 'spin-slow' | 'pulse-ring' | 'shadow-dance';
export type TextEffect = 'none' | 'gradient' | 'glitch' | 'typewriter' | 'neon-flicker';
export type EntranceAnimation = 'none' | 'fade-up' | 'scale' | 'slide-left' | 'slide-right' | 'slide-down' | 'spin-in' | 'flip-x' | 'bounce-in' | 'glitch-in' | 'zoom-rotate' | 'elastic' | 'blur-in' | 'drop-in';
export type HoverEffect = 'none' | 'lift' | 'glow' | 'scale' | 'neon' | 'shake' | 'underline-slide' | 'border-glow' | 'tilt-3d' | 'haul';
export type OverlayEffect = 'none' | 'vhs' | 'scanlines' | 'noise' | 'cyberpunk-glitch';
export type MusicType = 'spotify' | 'soundcloud' | 'custom';
export type LayoutPreset = 'centered' | 'left-aligned' | 'card' | 'minimal' | 'hero';
export type BorderStyle = 'none' | 'solid' | 'gradient' | 'animated' | 'dashed';
export type ProfileShape = 'circle' | 'rounded-square' | 'hexagon';
export type ClickEffect = 'none' | 'ripple' | 'confetti' | 'sparkle';
export type CustomCursor = 'default' | 'crosshair' | 'pointer' | 'custom';
export type BoxTilt = 'none' | 'scale' | 'reverse-scale' | 'tilt-x' | 'tilt-y';
export type UsernameSparkles = 'none' | 'rainbow' | 'gold' | 'silver' | 'fire' | 'ice';
export type AvatarDecoration = 'none' | 'cat-ears' | 'crown' | 'horns' | 'halo' | 'fire-ring';
export type ClickSound = 'none' | 'click' | 'pop' | 'blip';

export interface BioTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgType: BgType;
  bgColor1: string;
  bgColor2: string;
  bgImageUrl: string;
  bgVideoUrl?: string;
  bgPattern?: 'dots' | 'grid' | 'waves' | 'diagonal';
  fontFamily: string;
  cardStyle: CardStyle;
  borderRadius: number;
  glowEnabled: boolean;
  glowColor: string;
  glowIntensity: number;
}

export interface BioEffects {
  bgEffect: BgEffect;
  bgEffectIntensity: number;
  bgEffectColor: string;
  cursorTrail: CursorTrail;
  cursorTrailColor: string;
  avatarEffect: AvatarEffect;
  textEffect: TextEffect;
  entranceAnimation: EntranceAnimation;
  clickEffect: ClickEffect;
  hoverEffect: HoverEffect;
  overlayEffect?: OverlayEffect;
  customCursor: CustomCursor;
  audioVisualizer: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface CustomLink {
  title: string;
  url: string;
  icon: string;
  enabled: boolean;
}

export interface BioMusic {
  enabled: boolean;
  type: MusicType;
  url: string;
  autoplay: boolean;
}

export interface BioStat {
  label: string;
  value: string;
}

export interface BioStats {
  showViews: boolean;
  showJoinDate: boolean;
  customStats: BioStat[];
}

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

export interface GalleryImage {
  url: string;
  caption: string;
}

export interface StatusIndicator {
  enabled: boolean;
  text: string;
  emoji: string;
  color: string;
}

export interface Glassmorphism {
  enabled: boolean;
  blur: number;
  opacity: number;
}

export interface BackgroundOverlay {
  enabled: boolean;
  color: string;
  opacity: number;
}

export interface BioSeo {
  title: string;
  description: string;
  ogImage: string;
}

export interface EmbedVideo {
  enabled: boolean;
  url: string;
}

export interface DiscordWidget {
  enabled: boolean;
  userId: string;
}

export interface RevealScreen {
  enabled: boolean;
  text: string;
  blur: number;
}

export interface BioConfig {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  pronouns: string;
  location: string;
  badges: string[];
  theme: BioTheme;
  effects: BioEffects;
  socials: SocialLink[];
  customLinks: CustomLink[];
  music: BioMusic;
  stats: BioStats;
  customCss: string;

  // Banner
  bannerUrl: string;
  bannerHeight: number;
  bannerOpacity: number;
  bannerBlur: number;

  // Box (card container)
  boxWidth: number;
  boxSpacing: number;
  boxColor: string;
  boxOpacity: number;
  boxBlur: number;
  boxShadowColor: string;
  boxShadowOpacity: number;
  boxTilt: BoxTilt;

  // Border (granular)
  borderStyle: BorderStyle;
  borderWidth: number;
  borderColor: string;
  borderOpacity: number;

  // Background (granular)
  bgBlur: number;
  bgOpacity: number;

  // Avatar
  avatarDecoration: AvatarDecoration;
  avatarRadius: number;

  // Username
  usernameSparkles: UsernameSparkles;

  // Misc
  layoutPreset: LayoutPreset;
  scrollAnimation: boolean;
  glassmorphism: Glassmorphism;
  statusIndicator: StatusIndicator;
  seo: BioSeo;
  profileShape: ProfileShape;
  backgroundOverlay: BackgroundOverlay;
  hoverEffect: HoverEffect;
  clickEffect: ClickEffect;
  clickSound: ClickSound;
  typingBio: boolean;
  entranceSpeed: number;
  revealScreen: RevealScreen;

  // Widgets
  timeline: { enabled: boolean; items: TimelineItem[] };
  imageGallery: { enabled: boolean; images: GalleryImage[] };
  embedVideo: EmbedVideo;
  discordWidget: DiscordWidget;
  languageTag: string;
}

