export interface ImageGeneratorProps {
  // Prompt Components
  subject: string;  // Main subject description (e.g., "a red apple")
  style?: string;  // Style guidance (e.g., "digital art", "photorealistic")
  context?: string;  // Application context (e.g., "medical app with blue theme")
  negativePrompt?: string;  // What to avoid in the image
  
  // Generation Controls
  seed?: number;  // For reproducible results (0 to 4294967294)
  cfgScale?: number;  // Control strength (defaults to 7.0 for maximum control)
  
  // Display configuration
  width?: number | string;  // Width of the generated image container
  height?: number | string;  // Height of the generated image container
  cornerRadius?: number | string;  // Border radius of the container and image
  containerStyle?: React.CSSProperties;  // Additional container styles

  // Callbacks
  onGenerate?: (imageUrl: string) => void;
  onError?: (error: string) => void;
}

// Default values
export const defaultGenerationConfig = {
  cfgScale: 7.0,  // Maximum control strength by default
  seed: 0,
  width: '100%',
  height: 300,
  cornerRadius: 8
} as const;
