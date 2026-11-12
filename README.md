# Software Engineering MCQ Quiz

A browser-based practice quiz containing 222 Software Engineering MCQs in the original question order.

## Features

- One question on screen at a time.
- Previous and Next navigation.
- Correct answers show confirmation and automatically advance after two seconds.
- Wrong answers show the correct answer and a study explanation, with the option to retry.
- Optional auto-next, question overview, first-attempt score and results screen.
- Progress is stored in the current browser on the current device.
- Responsive layout and keyboard shortcuts: 1–4 to answer and arrow keys to navigate.

## Run locally

Open `dist/index.html` in a browser, or serve the `dist` directory with a static web server.

No dependency installation or build step is required.

## Deploy to Vercel

1. Import this GitHub repository into Vercel.
2. Use framework preset **Other**, with the repository root as the Root Directory.
3. Leave the Build Command empty and use **dist** as the Output Directory. The included `vercel.json` supplies these settings.
4. Deploy. Subsequent pushes to the connected production branch can deploy automatically.

The quiz is a static website. Hosting it does not synchronize existing browser progress between domains or devices. Answer choices and the answer key are delivered to the browser for study purposes.

## Files

- `dist/index.html`: quiz page.
- `dist/style.css`: responsive styling.
- `dist/app.js`: quiz interactions and saved progress.
- `dist/questions.js`: the questions, answer key and study explanations.
- `vercel.json`: Vercel hosting configuration.

The `.openai/hosting.json` file records the original Sites hosting configuration and is not used by Vercel.
