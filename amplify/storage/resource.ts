import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "alumnosStorage",
  access: (allow) => ({
    "alumnos-fotos/*": [
      allow.authenticated.to(["read", "write"]),
      allow.guest.to(["read"]),
    ],
  }),
});
