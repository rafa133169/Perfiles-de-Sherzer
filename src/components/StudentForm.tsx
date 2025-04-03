import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface StudentFormProps {
  onSuccess: () => void;
}

type EvaluacionTipo = 'suma' | 'resta' | 'multiplicacion' | 'division';
type EvaluacionNivel = 'inicio_de_proceso' | 'en_proceso' | 'proceso_completo';

export default function StudentForm({ onSuccess }: StudentFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    foto: '',
    sum: 'inicio_de_proceso' as EvaluacionNivel,
    subtract: 'inicio_de_proceso' as EvaluacionNivel,
    multiply: 'inicio_de_proceso' as EvaluacionNivel,
    divide: 'inicio_de_proceso' as EvaluacionNivel
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Crear el alumno
      const { data: newStudent, errors } = await client.models.Alumno.create({
        nombre: formData.nombre,
        apellido: formData.apellido,
        foto: formData.foto,
        createdAt: new Date().toISOString()
      });

      if (!newStudent || errors) {
        throw new Error(errors?.[0]?.message || 'Error al crear alumno');
      }

      // Crear las evaluaciones
      const evaluationTypes: {
        tipo: EvaluacionTipo;
        nivel: EvaluacionNivel;
      }[] = [
        { tipo: 'suma', nivel: formData.sum },
        { tipo: 'resta', nivel: formData.subtract },
        { tipo: 'multiplicacion', nivel: formData.multiply },
        { tipo: 'division', nivel: formData.divide }
      ];

      await Promise.all(
        evaluationTypes.map(evalType => 
          client.models.Evaluacion.create({
            tipo: evalType.tipo,
            nivel: evalType.nivel,
            alumnoId: newStudent.id
          })
        )
      );

      alert('Alumno registrado exitosamente!');
      onSuccess();
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Error al registrar alumno');
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md max-w-md mx-auto my-5">
      <h2 className="text-xl font-bold text-center mb-4 text-blue-800">Registrar Alumno</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          placeholder="Apellido"
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="file"
          name="foto"
          onChange={(e) => setFormData(prev => ({ ...prev, foto: e.target.files?.[0]?.name || '' }))}
          accept="image/*"
          className="w-full p-2 mb-3 border rounded"
        />
        
        {(['sum', 'subtract', 'multiply', 'divide'] as const).map((operation) => (
          <div key={operation} className="mb-3">
            <label className="block mb-1">
              {operation === 'sum' && 'Suma'}
              {operation === 'subtract' && 'Resta'}
              {operation === 'multiply' && 'Multiplicación'}
              {operation === 'divide' && 'División'}:
            </label>
            <select
              name={operation}
              value={formData[operation]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="inicio_de_proceso">Inicio de proceso</option>
              <option value="en_proceso">En proceso</option>
              <option value="proceso_completo">Proceso completo</option>
            </select>
          </div>
        ))}
        
        <button
          type="submit"
          className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Registrar Alumno
        </button>
      </form>
    </div>
  );
}