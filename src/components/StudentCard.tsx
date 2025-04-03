import { useEffect, useRef } from 'react';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler);

interface Student {
  firstName: string;
  lastName: string;
  evaluations: {
    sum: string;
    subtract: string;
    multiply: string;
    divide: string;
  };
}

const evaluate = (value: string): number => {
  return value === "inicio de proceso" ? 0 : 
         value === "en proceso" ? 1 : 2;
};

export default function RadarChart({ student }: { student: Student }) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['Suma', 'Resta', 'Multiplicación', 'División'],
            datasets: [{
              label: `${student.firstName} ${student.lastName}`,
              data: [
                evaluate(student.evaluations.sum),
                evaluate(student.evaluations.subtract),
                evaluate(student.evaluations.multiply),
                evaluate(student.evaluations.divide)
              ],
              backgroundColor: 'rgba(0, 123, 255, 0.2)',
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 1,
              pointBackgroundColor: 'rgba(0, 123, 255, 1)'
            }]
          },
          options: {
            scales: {
              r: {
                angleLines: {
                  display: true
                },
                suggestedMin: 0,
                suggestedMax: 2,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [student]);

  return <canvas ref={chartRef} />;
}