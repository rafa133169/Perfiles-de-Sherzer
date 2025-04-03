import { useState } from 'react';

interface StudentSearchProps {
  onSearch: (term: string) => void;
}

export default function StudentSearch({ onSearch }: StudentSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md max-w-md mx-auto my-5">
      <h2 className="text-xl font-bold text-center mb-4 text-blue-800">Buscar Alumno</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar Alumno"
        className="w-full p-2 mb-3 border rounded"
      />
      <button
        onClick={handleSearch}
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Buscar
      </button>
    </div>
  );
}