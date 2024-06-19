import { initializeApp } from "firebase/app";

export const environment = {
    production: true,
    firebaseConfig: {
      apiKey: "AIzaSyB0OlUTPxMu6BAF5wfpQnZIAmTOtTWn9JQ",
      authDomain: "pipe-kanban.firebaseapp.com",
      projectId: "pipe-kanban",
      storageBucket: "pipe-kanban.appspot.com",
      messagingSenderId: "427948758855",
      appId: "1:427948758855:web:f70664583dcffc4be65e62"
    }
};

// Inicialize o Firebase com a configuração fornecida no ambiente
export const app = initializeApp(environment.firebaseConfig);
