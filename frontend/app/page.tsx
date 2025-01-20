'use client'
import { useState } from 'react';
import ImageGenerator from './components/ImageGenerator';

// Define type for component props
type ScenarioProps = {
  subject: string;
  style?: string;
  context?: string;
  negativePrompt?: string;
  width?: number | string;
  height?: number | string;
  cornerRadius?: number | string;
  containerStyle?: React.CSSProperties;
};

// Define type for scenarios
type Scenario = {
  name: string;
  props: ScenarioProps;
};

// Predefined scenarios to showcase different use cases
const scenarios: Record<string, Scenario> = {
  basic: {
    name: 'Basic Usage',
    props: {
      subject: 'A serene mountain landscape',
    }
  },
  medical: {
    name: 'Medical App Icon',
    props: {
      subject: 'A medical cross symbol',
      style: 'minimalist line art',
      context: 'healthcare app with blue theme',
      negativePrompt: 'complex, detailed, photorealistic',
      width: 200,
      height: 200,
      cornerRadius: 16,
      containerStyle: {
        backgroundColor: '#f0f9ff',
        padding: '20px'
      }
    }
  },
  ecommerce: {
    name: 'E-commerce Product',
    props: {
      subject: 'A sleek modern watch',
      style: 'product photography',
      context: 'luxury e-commerce website',
      negativePrompt: 'blurry, low quality, distorted',
      width: '100%',
      height: 400,
      cornerRadius: 8,
    }
  },
  gaming: {
    name: 'Game Asset',
    props: {
      subject: 'A magical glowing sword',
      style: 'digital art, fantasy style',
      context: 'dark theme gaming interface',
      negativePrompt: 'realistic, photographic',
      width: 300,
      height: 400,
      cornerRadius: 0,
      containerStyle: {
        backgroundColor: '#1a1a1a',
        padding: '16px'
      }
    }
  }
};

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState('basic');
  const [customProps, setCustomProps] = useState<ScenarioProps>(scenarios.basic.props);
  
  // Custom controls state
  const [subject, setSubject] = useState(scenarios.basic.props.subject);
  const [style, setStyle] = useState('');
  const [context, setContext] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('300');
  const [cornerRadius, setCornerRadius] = useState('8');

  const handleScenarioChange = (scenario: keyof typeof scenarios) => {
    setSelectedScenario(scenario);
    const newProps = scenarios[scenario as keyof typeof scenarios].props;
    setCustomProps(newProps);
    
    // Update custom controls
    setSubject(newProps.subject || '');
    setStyle(newProps.style || '');
    setContext(newProps.context || '');
    setNegativePrompt(newProps.negativePrompt || '');
    setWidth(String(newProps.width || '100%'));
    setHeight(String(newProps.height || '300'));
    setCornerRadius(String(newProps.cornerRadius || '8'));
  };

  const handleGenerate = (url: string) => {
    console.log('Image generated:', url);
  };

  const handleError = (error: string) => {
    console.error('Error:', error);
  };

  // Generate code snippet based on current props
  const generateCodeSnippet = () => {
    const props = {
      subject,
      ...(style ? { style } : {}),
      ...(context ? { context } : {}),
      ...(negativePrompt ? { negativePrompt } : {}),
      ...(width !== '100%' ? { width: Number(width) || width } : {}),
      ...(height !== '300' ? { height: Number(height) || height } : {}),
      ...(cornerRadius !== '8' ? { cornerRadius: Number(cornerRadius) || cornerRadius } : {}),
    };

    return `<ImageGenerator 
  ${Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n  ')}
  onGenerate={(url) => console.log('Generated:', url)}
  onError={(error) => console.error('Error:', error)}
/>`;
  };

  return (
    <main className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-black">
            AI Image Generator Demo
          </h1>
          <p className="text-black">
            Explore different ways to use the ImageGenerator component
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">Preset Scenarios</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(scenarios).map(([key, scenario]) => (
                  <button
                    key={key}
                    onClick={() => handleScenarioChange(key)}
                    className={`px-4 py-2 rounded ${
                      selectedScenario === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 hover:bg-blue-200 text-black'
                    }`}
                  >
                    {scenario.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Custom Controls</h3>
              
              <div>
                <label className="block text-sm font-medium text-black">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black">Style</label>
                <input
                  type="text"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black placeholder-gray-600"
                  placeholder="e.g., photographic, digital art, minimalist"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black">Context</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black placeholder-gray-600"
                  placeholder="e.g., travel website with earth tones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black">Negative Prompt</label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black placeholder-gray-600"
                  placeholder="e.g., blurry, low quality, distorted"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Width</label>
                  <input
                    type="text"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black placeholder-gray-600"
                    placeholder="e.g., 500 or 100%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black">Height</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black placeholder-gray-600"
                    placeholder="e.g., 400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black">Corner Radius</label>
                  <input
                    type="text"
                    value={cornerRadius}
                    onChange={(e) => setCornerRadius(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black placeholder-gray-600"
                    placeholder="e.g., 8 or 0"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-black">React Usage Code</h3>
              <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                <code>{generateCodeSnippet()}</code>
              </pre>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black">Preview</h2>
            <ImageGenerator 
              subject={subject}
              style={style}
              context={context}
              negativePrompt={negativePrompt}
              width={width}
              height={Number(height) || height}
              cornerRadius={Number(cornerRadius) || cornerRadius}
              onGenerate={handleGenerate}
              onError={handleError}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
