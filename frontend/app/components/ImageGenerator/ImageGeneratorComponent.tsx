'use client'
import React, { useState, useCallback, memo } from 'react'
import { ImageGeneratorProps, defaultGenerationConfig } from './types'

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, keyof ImageGeneratorProps> & ImageGeneratorProps;

function ImageGenerator({
  // Prompt Components
  subject,
  style,
  context,
  negativePrompt,
  // Generation Controls
  seed = defaultGenerationConfig.seed,
  cfgScale = defaultGenerationConfig.cfgScale,
  // Display props
  width = defaultGenerationConfig.width,
  height = defaultGenerationConfig.height,
  cornerRadius = defaultGenerationConfig.cornerRadius,
  containerStyle,
  // Callback props
  onGenerate,
  onError,
  className,
  ...rest
}: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateImage = useCallback(async () => {
    if (!subject) {
      setError('Please provide a subject description for the image')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData();
      formData.append('subject', subject);
      if (style) {
        formData.append('style', style);
      }
      if (context) {
        formData.append('context', context);
      }
      if (negativePrompt) {
        formData.append('negative_prompt', negativePrompt);
      }

      const response = await fetch('http://localhost:8000/generate_image/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to generate image')
      }

      const data = await response.json()
      setImageUrl(data.image_url)
      onGenerate?.(data.image_url)
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [subject, style, context, negativePrompt, cfgScale, seed, onGenerate, onError])

  // Combine styles
  const containerStyles: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: cornerRadius,
    ...containerStyle
  };

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: cornerRadius
  };

  return (
    <div {...rest} className={className} style={containerStyles}>
      <div className="h-full flex flex-col gap-4">
        {/* Preview/Result Section */}
        <div 
          className="flex-grow bg-white shadow-sm border overflow-hidden"
          style={{ borderRadius: cornerRadius }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Generated image"
              style={imageStyles}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
              {loading ? 'Generating...' : 'Image preview will appear here'}
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="flex flex-col gap-2">
          <button
            onClick={generateImage}
            disabled={loading}
            className={`w-full py-2 px-4 font-medium transition-colors ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            style={{ borderRadius: cornerRadius }}
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>

          {error && (
            <div 
              className="bg-red-50 text-red-500 p-3"
              style={{ borderRadius: cornerRadius }}
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ImageGeneratorComponent = memo(ImageGenerator);
ImageGeneratorComponent.displayName = 'ImageGenerator';

export default ImageGeneratorComponent;
