# Quivia

Studying can be a drag, and studying with friends can be unproductive... With **Quivia**, both problems are solved! 

Quivia allows you to upload your study notes and uses generative AI to create a set of questions that you can compete with friends to answer.

# Project Setup
## Set Up the Environment

1. **Frontend**  
    Navigate to the `frontend` folder and create a `.env` file with the following contents:
    ```bash
    REACT_APP_AUTH0_DOMAIN='your-AUTH0-domain'
    REACT_APP_AUTH0_CLIENT_ID='your-AUTH0-client-id'
    AUTH0_SECRET='your-AUTH0-secret'
    BASE_URL='http://localhost:3000'
    AUTH0_ISSUER_BASE_URL='your-AUTH0-issuer-base-url'
    REACT_APP_AUTH0_REDIRECT_URI='http://localhost:3001'
    ```

2. **Backend**  
    Navigate to the `backend` folder and create a `.env` file with the following contents:
    ```bash
    OPENAI_API_KEY='your-OpenAI-api-key'
    PORT=3000
    AUTH0_SECRET='your-AUTH0-secret'
    BASE_URL='http://localhost:3000'
    AUTH0_CLIENT_ID='your-AUTH0-client-id'
    AUTH0_ISSUER_BASE_URL='your-AUTH0-issuer-base-url'
    MONGODB_URI='mongodb+srv://your-username:your-password@your-cluster.mongodb.net/?retryWrites=true&w=majority&appName=your-app-name'
    ```

## Running the Application

1. In the terminal, go to the `backend` folder, then run:
    ```bash
    cd backend
    npm install
    npm start
    ```

2. Open another terminal and go to the `frontend` folder, then run:
    ```bash
    cd frontend
    npm install
    npm start
    ```

3. Open your browser and navigate to [http://localhost:3001](http://localhost:3001).


## Coming soon:
Harness the power of adrenaline to make studying even more effective with **Scary Mode**!
