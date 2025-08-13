# One-Click Deploy via Vercel Button

Click the button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A//github.com/your-username/shorting-webapp&project-name=shorting-webapp&repository-name=shorting-webapp&env=ALPHA_VANTAGE_KEY%2CPOSTGRES_URL%2CPOSTGRES_URL_NON_POOLING%2CPOSTGRES_USER%2CPOSTGRES_PASSWORD%2CPOSTGRES_HOST%2CPOSTGRES_DATABASE&envDescription=Set%20your%20Alpha%20Vantage%20key%20and%20Vercel%20Postgres%20credentials%20%28auto-provision%20via%20integration%29.&envLink=https%3A//github.com/your-username/shorting-webapp%23environment-variables)

### What it does
- Imports this repo to your Vercel project.
- Prompts you to set **Environment Variables** (predeclared).
- Deploys with zero-touch DB initialization (first request bootstraps schema).

### Notes
- Replace the placeholder repository URL in this README with your actual GitHub repo URL after you push.
- If you use Vercel Postgres integration, the Postgres vars will be auto-populated. Otherwise, paste them manually.
