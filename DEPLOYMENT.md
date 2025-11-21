# GitHub Pages Deployment Instructions

## Enabling GitHub Pages

1. **Go to your repository on GitHub:**
   - Navigate to: https://github.com/rvasappa-ucsd/dsc209_final_project

2. **Access Settings:**
   - Click the "Settings" tab (top menu)

3. **Navigate to Pages:**
   - In the left sidebar, click "Pages" under "Code and automation"

4. **Configure Source:**
   - Under "Build and deployment"
   - Source: Select "Deploy from a branch"
   - Branch: Select "main" and "/ (root)"
   - Click "Save"

5. **Wait for Deployment:**
   - GitHub will build and deploy your site (takes 1-2 minutes)
   - A message will appear with your site URL
   - URL will be: https://rvasappa-ucsd.github.io/dsc209_final_project/

6. **Verify Deployment:**
   - Click the URL to view your live site
   - All visualizations should load (except map if no Mapbox token added)

## Your Project URL

Once enabled, your project will be available at:

**https://rvasappa-ucsd.github.io/dsc209_final_project/**

This is the URL you'll submit on Canvas.

## Troubleshooting

If the page doesn't load:
- Check that the branch is set to "main" (not "master")
- Ensure index.html is in the root directory (not in a subfolder)
- Wait a few minutes for GitHub to process the deployment
- Check the "Actions" tab for any build errors

## Adding Mapbox Token (Optional)

To enable the interactive map:
1. Sign up at https://mapbox.com
2. Get your free access token
3. Edit `map-viz.js` in your repository
4. Replace `YOUR_MAPBOX_TOKEN_HERE` with your actual token
5. Commit and push the change
6. Wait for GitHub Pages to rebuild

## Project Components Checklist

✅ **Webpage:** index.html serves the main page
✅ **GitHub Repo:** Public repository at rvasappa-ucsd/dsc209_final_project
✅ **Visualizations:** 3 interactive visualizations:
   - GDP pie chart with click interaction
   - Health scatter plot with hover tooltips and year slider
   - Map visualization (placeholder until token added)
✅ **Writeup:** 8+ sentences covering progress and challenges

## Submission

Submit this URL on Canvas:
**https://rvasappa-ucsd.github.io/dsc209_final_project/**
