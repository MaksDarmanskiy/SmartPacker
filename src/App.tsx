import React, { useState } from 'react';
import type { FC } from 'react'; // ВИПРАВЛЕНО: Для React.FC
import type { GeneratedData, TripFormData } from './types/types'; // ВИПРАВЛЕНО: Коректний шлях
import TripForm from './components/TripForms';
import PackingListView from './components/PackingListView';
import { generatePackingList } from './utils/packingGenerator'; // Припустимо, що ім'я файлу 'packingGenerator'

const App: FC = () => { // ВИПРАВЛЕНО: Використання FC з import type
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);

  const handleFormSubmit = (formData: TripFormData): void => {
    // Тут має бути логіка генерації списку пакування, яка використовує formData
    const packingData = generatePackingList(formData);
    setGeneratedData(packingData);
  };

  const handleReset = (): void => {
    setGeneratedData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      {generatedData ? (
        <PackingListView data={generatedData} onReset={handleReset} />
      ) : (
        <TripForm onSubmit={handleFormSubmit} />
      )}
    </div>
  );
};

export default App;