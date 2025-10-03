
import React, { useState, useCallback, useRef } from 'react';
import { toBase64 } from './utils/fileUtils';
import { generateCaptionFromImage } from './services/geminiService';
import { Icon } from './components/Icon';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('Describe this image in detail. Be creative and evocative.');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Gemini API has a 4MB limit for inline data
          setError('Image size must be less than 4MB.');
          setImageFile(null);
          setImageUrl(null);
          setCaption('');
          return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setCaption('');
      setError('');
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateCaption = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setCaption('');

    try {
      const base64Image = await toBase64(imageFile);
      const generatedCaption = await generateCaptionFromImage(
        base64Image,
        imageFile.type,
        prompt
      );
      setCaption(generatedCaption);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate caption: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, prompt]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-6xl mx-auto text-center mb-8 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text mb-2">
          AI Image Caption Generator
        </h1>
        <p className="text-slate-400 text-lg">Harnessing multimodal AI to bring your images to life with words.</p>
      </header>

      <main className="container mx-auto max-w-6xl flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 w-full animate-slide-in">
        
        {/* Left Column: Image Upload & Prompt */}
        <div className="flex flex-col space-y-6 bg-slate-900/50 p-6 rounded-2xl shadow-2xl border border-slate-700/50">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">Your Prompt</label>
            <textarea
              id="prompt"
              rows={3}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Describe this image for a children's book"
            />
          </div>
          <div className="flex-grow flex flex-col justify-center items-center border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-brand-primary hover:bg-slate-800/50 transition-colors duration-300" onClick={triggerFileSelect}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            {imageUrl ? (
              <img src={imageUrl} alt="Selected preview" className="max-h-80 w-auto rounded-lg object-contain" />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Icon name="image" className="w-16 h-16 mb-4 text-slate-500" />
                <span className="font-semibold text-slate-300">Click to upload an image</span>
                <span className="text-sm">PNG, JPG, or WEBP (Max 4MB)</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Caption Result */}
        <div className="bg-slate-900/50 p-6 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col">
           <button
            onClick={handleGenerateCaption}
            disabled={!imageFile || isLoading}
            className="w-full flex items-center justify-center bg-brand-primary hover:bg-brand-secondary disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-6"
          >
            {isLoading ? <Spinner className="w-6 h-6" /> : <Icon name="sparkles" className="w-6 h-6 mr-2" />}
            <span>{isLoading ? 'Generating...' : 'Generate Caption'}</span>
          </button>
          <div className="flex-grow bg-slate-800/70 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            {isLoading && (
              <div className="text-center text-slate-400">
                <p>AI is analyzing the image...</p>
              </div>
            )}
            {error && <div className="text-red-400 text-center">{error}</div>}
            {!isLoading && !error && caption && (
              <p className="text-slate-200 whitespace-pre-wrap animate-fade-in">{caption}</p>
            )}
            {!isLoading && !error && !caption && (
               <p className="text-slate-500 text-center">Your generated caption will appear here.</p>
            )}
          </div>
        </div>
      </main>
      
      <footer className="text-center p-4 mt-8 text-slate-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
