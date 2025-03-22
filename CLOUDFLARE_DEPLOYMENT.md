# Deploying to Cloudflare Pages

This guide explains how to deploy the Chroma11y Accessible Color Contrast Tool to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- Access to the GitHub repository (or your preferred Git provider)

## Deployment Steps

1. Log in to your Cloudflare dashboard at [dash.cloudflare.com](https://dash.cloudflare.com/)

2. Navigate to **Pages** in the sidebar menu

3. Click **Create a project** > **Connect to Git**

4. Choose your Git provider (GitHub, GitLab, etc.) and authenticate

5. Select the repository containing the Chroma11y application

6. Configure the build settings:
   - **Project name**: `chroma11y` (or your preferred name)
   - **Production branch**: `main` (or your default branch)
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or the directory containing your project)

7. Under **Environment variables**, add the following if needed:
   - `NODE_VERSION`: `16` (or higher)

8. Click **Save and Deploy**

Cloudflare Pages will automatically build and deploy your site. Once deployed, you'll receive a URL like `https://your-project-name.pages.dev`.

## Custom Domain (Optional)

To use a custom domain:

1. Go to your Pages project in the Cloudflare dashboard
2. Click **Custom domains** > **Set up a custom domain**
3. Enter your domain and follow the instructions
4. Update DNS settings as directed by Cloudflare

## Continuous Deployment

Cloudflare Pages automatically deploys updates when you push changes to your repository's main branch.

## Build Errors?

If you encounter build errors, check:
- That all dependencies are correctly specified in `package.json`
- That the build command and output directory are correctly configured
- Cloudflare Pages build logs for specific error messages 