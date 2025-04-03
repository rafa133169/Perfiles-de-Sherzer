import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import StudentForm from '../components/StudentForm';
import StudentSearch from '../components/StudentSearch';
import StudentCard from '../components/StudentCard';

const client = generateClient<Schema>();

interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  foto?: string | null;
  createdAt: string;
}

export default function HomePage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState<Alumno[]>([]);

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const fetchAlumnos = async () => {
    try {
      const { data: alumnoItems, errors } = await client.models.Alumno.list();
      
      if (errors) {
        console.error('Error fetching alumnos:', errors);
        return;
      }

      const plainAlumnos = alumnoItems.map(alumno => ({
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        foto: alumno.foto,
        createdAt: alumno.createdAt
      }));

      setAlumnos(plainAlumnos);
      setFilteredAlumnos(plainAlumnos);
    } catch (error) {
      console.error('Error fetching alumnos:', error);
    }
  };

  const handleAddSuccess = () => {
    fetchAlumnos();
  };

  const handleSearch = (term: string) => {
    if (!term) {
      setFilteredAlumnos(alumnos);
      return;
    }

    const filtered = alumnos.filter(alumno =>
      (alumno.nombre?.toLowerCase() || '').includes(term.toLowerCase()) ||
      (alumno.apellido?.toLowerCase() || '').includes(term.toLowerCase())
    );
    setFilteredAlumnos(filtered);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-8xl font-bold text-red-100 opacity-20">IBIME</span>
      </div>
      
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6 relative z-10">Perfiles de Sherzer</h1>
      
      <div className="relative z-10">
        <StudentForm onSuccess={handleAddSuccess} />
        <StudentSearch onSearch={handleSearch} />
        
        <div className="max-w-4xl mx-auto">
          {filteredAlumnos.map(alumno => (
            <StudentCard 
              key={alumno.id} 
              student={{
                firstName: alumno.nombre,
                lastName: alumno.apellido,
                evaluations: {
                  sum: 'inicio de proceso', // Estos valores deberían venir de las evaluaciones
                  subtract: 'inicio de proceso',
                  multiply: 'inicio de proceso',
                  divide: 'inicio de proceso'
                }
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}