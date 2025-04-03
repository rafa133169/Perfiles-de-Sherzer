import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplifyViteReactStorage",
  access: (allow) => ({
    "fotos-alumnos/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});
