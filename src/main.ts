import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// 🔥 Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from "./environments/environment";

// Initialisation Firebase
const app = initializeApp(environment.firebase);
getAnalytics(app);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
