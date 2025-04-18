import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
// import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import App from "./App";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  
  <React.StrictMode>
    {/* <Authenticator>
      <App/>
    </Authenticator> */}
    <App/>
  </React.StrictMode>
);

