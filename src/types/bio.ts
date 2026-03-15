export type BgType = 'solid' | 'gradient' | 'image';
export type CardStyle = 'glass' | 'solid' | 'outline' | 'neon';
export type BgEffect = 'none' | 'particles' | 'matrix' | 'stars' | 'rain' | 'snow' | 'fireflies';
export type CursorTrail = 'none' | 'glow' | 'sparkle' | 'trail' | 'fire';
export type AvatarEffect = 'none' | 'glow-pulse' | 'rotate-border' | 'glitch' | 'breathe';
export type TextEffect = 'none' | 'gradient' | 'glitch' | 'typewriter' | 'neon-flicker';
export type EntranceAnimation = 'none' | 'fade-up' | 'scale' | 'slide-left' | 'glitch-in';
export type MusicType = 'spotify' | 'soundcloud' | 'custom';
export type LayoutPreset = 'centered' | 'left-aligned' | 'card' | 'minimal' | 'hero';
export type BorderStyle = 'none' | 'solid' | 'gradient' | 'animated' | 'dashed';
export type ProfileShape = 'circle' | 'rounded-square' | 'hexagon';
export type ClickEffect = 'none' | 'ripple' | 'confetti' | 'sparkle';
export type CustomCursor = 'default' | 'crosshair' | 'pointer' | 'custom';

export interface BioTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgType: BgType;
  bgColor1: string;
  bgColor2: string;
  bgImageUrl: string;
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

export interface BioConfig {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  pronouns: string;
  badges: string[];
  theme: BioTheme;
  effects: BioEffects;
  socials: SocialLink[];
  customLinks: CustomLink[];
  music: BioMusic;
  stats: BioStats;
  customCss: string;

  // New fields
  bannerUrl: string;
  bannerHeight: number;
  layoutPreset: LayoutPreset;
  scrollAnimation: boolean;
  glassmorphism: Glassmorphism;
  borderStyle: BorderStyle;
  statusIndicator: StatusIndicator;
  seo: BioSeo;
  profileShape: ProfileShape;
  backgroundOverlay: BackgroundOverlay;
  clickEffect: ClickEffect;
  typingBio: boolean;
  timeline: { enabled: boolean; items: TimelineItem[] };
  imageGallery: { enabled: boolean; images: GalleryImage[] };
  embedVideo: EmbedVideo;
  discordWidget: DiscordWidget;
  languageTag: string;
}
