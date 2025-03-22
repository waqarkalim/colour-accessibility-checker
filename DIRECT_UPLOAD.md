# Direct Upload to Cloudflare Pages

If you prefer to deploy without connecting to Git, you can use Cloudflare Pages' Direct Upload option.

## Preparation

1. Make sure you've built the project with:
   ```
   pnpm build
   ```

2. The `dist` directory should now contain all the files needed for deployment.

## Deployment Steps

1. Log in to your Cloudflare dashboard at [dash.cloudflare.com](https://dash.cloudflare.com/)

2. Navigate to **Pages** in the sidebar menu

3. Click **Create a project** > **Direct Upload**

4. Enter a project name (e.g., `chroma11y`)

5. Click **Create project**

6. On the next screen, either:
   - Drag and drop the entire `dist` folder onto the upload area
   - Click to browse and select the `dist` folder

7. Wait for the upload to complete

8. Click **Save and Deploy**

After deployment completes, you'll receive a unique URL like `https://your-project-name.pages.dev` where your application is hosted.

## Updating Your Deployment

To update your site in the future:

1. Make your changes to the codebase
2. Rebuild with `pnpm build`
3. Go to your Pages project in the Cloudflare dashboard
4. Click **Deployments** > **Upload** (in the top-right corner)
5. Upload the new `dist` folder
6. Cloudflare will create a new deployment with your changes

## Adding Custom Domains

1. Go to your Pages project
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Follow the instructions to add and verify your domain 