## NOX PLATFORM

This is a final year project on the issuance and verification of official documents. 
1. User signs in with their crypto wallet.
2. A platform scoped wallet is created for the user in the backend.
3. This wallet encrypts users documents using public key and stores it in IPFS.
4. User can share their document with other users by encrypting it with the other user's public key. (A search functionality has been implemented for users to search other users.)
5. Documents can have access control on their documents.

### Installation
First, clone the repository:
Then, install the required dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, create .env file and set environmental variables
Lastly, run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
