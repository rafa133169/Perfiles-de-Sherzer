export interface Student {
  id?: string;
  firstName: string;
  lastName: string;
  photo?: string;
  evaluations: {
    sum: "inicio de proceso" | "en proceso" | "proceso completo";
    subtract: "inicio de proceso" | "en proceso" | "proceso completo";
    multiply: "inicio de proceso" | "en proceso" | "proceso completo";
    divide: "inicio de proceso" | "en proceso" | "proceso completo";
  };
}

export const evaluate = (
  value: Student["evaluations"][keyof Student["evaluations"]]
): number => {
  return value === "inicio de proceso" ? 0 : value === "en proceso" ? 1 : 2;
};
