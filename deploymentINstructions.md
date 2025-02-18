
1. **Prepare the Backend First**
```js
// Add a vercel.json in the backend folder:
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

2. **Browser Deployment Steps**

```markdown
1. Open Chrome and go to https://vercel.com
2. Sign in with your GitHub account
3. Click "Add New..." > "Project"
4. Choose your repository "CustomerInsightsPlatform"
5. Configure the project:
   - Root Directory: `backend`  
   - Build Command: Leave empty
   - Output Directory: Leave empty
   - Install Command: `npm install`
   
6. Environment Variables:
   Click "Environment Variables" and add:
   - Name: MONGODB_URI
   - Value: Your MongoDB connection string
   
7. Click "Deploy"
```

3. **Frontend Configuration**
```ts
// Update src/hooks/useData.ts to use the Vercel backend URL:

const API_URL = 'https://your-backend-url.vercel.app/graphql';
```

4. **Frontend Deployment Steps**
```markdown
1. In Vercel dashboard, click "Add New..." > "Project" again
2. Select the same repository
3. Configure the project:
   - Root Directory: ./  (root of the project)
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
   
4. Click "Deploy"
```

5. **Connect Frontend to Backend**
```markdown
1. After both deployments complete, copy your backend URL
2. Go to frontend project settings in Vercel
3. Add environment variable:
   - VITE_API_URL=https://your-backend-url.vercel.app
```

6. **Verify Deployment**
```markdown
1. Check frontend URL works
2. Test backend GraphQL endpoint:
   - Visit https://your-backend-url.vercel.app/graphql
   - GraphiQL interface should load
   - Try a test query:
   ```graphql
   {
     reviews {
       id
       text
       sentiment
     }
   }
   ```

7. **Troubleshooting**
```markdown
- Check Vercel deployment logs if issues occur
- Verify MongoDB connection works
- Ensure CORS is properly configured
- Test GraphQL endpoint responses
```
