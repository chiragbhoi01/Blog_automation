How to Record a Web App Walkthrough Your Client Can Actually Search
When you send a 15-minute product walkthrough, clients rarely rewatch the whole video to find a single setting. Instead, they ping you on Slack or email to ask where to click.
This guide shows you how to record a web app walkthrough that indexes both what you say and what appears on screen. By the end, you will have a shareable link where your client can search for any button, route, or step and jump straight to the exact second it happens.
Quick Steps:
Launch the recorder: Open your web app and start Demoly via the browser extension.
Record the workflow: Click through the app actions normally with or without voice narration.
Finish and process: Stop the session to automatically index spoken audio, visible UI text, and on-screen clicks.
Copy the share link: Set viewer permissions and copy the link for your client.
Client searches: The viewer types questions or UI names into the search bar to jump directly to relevant video timestamps.
Before You Start
Install the Demoly Chrome extension.
Log into the web app you plan to demonstrate and open it in an active browser tab.
If you plan to provide voice narration, verify your microphone input in your browser permissions.
Step 1: Open the Extension and Select Your Capture Target
Navigate to the initial screen of your web app. Click the Demoly icon in your browser toolbar to open the recording prompt.
Select Current Tab if your entire walkthrough stays inside one tool. Choose Entire Screen if the workflow requires switching between multiple desktop windows or third-party web apps.
[Visual Reference: Tightly cropped screenshot of the Demoly browser extension popup with "Current Tab" selected and the microphone input toggle set to active.]
Step 2: Record the Walkthrough Actions
Click Start Recording. A three-second countdown will display before capture begins.
Perform the workflow at a normal working pace. Click buttons, open dropdowns, and navigate through the relevant settings panels.
You do not need to read every button label aloud. Demoly indexes the text visible on the web page as you interact with it. If you navigate to an unvoiced setting like "Billing Settings" or "API Webhooks," the text remains searchable to the client later.
[Visual Reference: Browser view of a web application settings dashboard during active recording, showing a clean cursor clicking on an "Integrations" menu tab.]
Step 3: Stop the Recording and Let the Walkthrough Process
Once you finish the walkthrough, click the red Stop button on the floating recording control bar.
Demoly opens the video in a new browser tab and processes the assets automatically. During this step, the engine creates the video playback stream, transcribes spoken audio, and maps on-screen UI elements and clicks into a searchable index.
[Visual Reference: Processing state in the Demoly web editor showing the video timeline loading with an "Indexing video and UI elements" progress indicator.]
Step 4: Verify Searchability in the Editor
Before sharing the walkthrough, test the search drawer on the right side of the video player.
Type a word that appeared on screen during your recording, such as "API key" or "Export," into the Ask or Search bar. The drawer will return direct timestamp citations matching that text, even if you did not say the word out loud.
Click on any returned timestamp result to verify that the playhead jumps directly to that moment in the video.
[Visual Reference: The Demoly video player showing the search sidebar on the right, displaying two timestamped query results ("02:14 - Integrations Page" and "04:30 - Generate Webhook") with a highlighted play button.]
Step 5: Configure Access and Copy the Share Link
Click the Share button in the top-right corner of the editor canvas.
Set the permissions dropdown to Viewer Only. This allows the client to watch the recording, search the content, and leave time-stamped comments without altering your source video or trims.
Click Copy Link.
[Visual Reference: The Demoly Share modal open with "Viewer Only" selected in the dropdown menu and the "Copy Link" button highlighted.]
How to Verify It Worked
To confirm what your client will experience:
Open a new private or incognito browser window.
Paste the copied link into the address bar.
Verify that the video player loads immediately with the search drawer accessible and no login prompt required.
What the Client Sees and How They Search
When your client opens the link, they do not need to install an extension or sign up for an account.
They can interact with the video in two ways:
Natural Language Questions: The client can type full questions into the search bar, such as "Where do I invite team members?" The player returns a direct answer with a clickable timestamp.
Keyword Matching: The client can type exact UI labels (like "Stripe Secret Key" or "Webhook URL"). The player filters the timeline and highlights every point where that element was clicked or displayed.
Clicking any result jumps the playhead to that exact second, letting the client see the action without rewatching the full recording.
[Visual Reference: Recipient view in an incognito browser window showing a user query in the right sidebar: "Where do I add a new user?" with an automated timestamp link pointing to 01:45.]
Important Notes & Edge Cases
Dynamic Modals: When demonstrating features inside flyout panels or dropdowns, leave the panel open for at least one full second so the text is cleanly indexed.
Sensitive Information: If you type live credentials or staging API keys during the walkthrough, use Demoly's Redact tool in the editor to mask those fields before generating the share link.
Silent Walkthroughs: Voice narration is optional. If you record in a noisy environment without audio, the client can still search through every visual action, button name, and navigation step.
Next Steps
Your searchable walkthrough is ready to share with clients, reducing repetitive follow-up questions. Demoly provides full recording, automated UI indexing, and zero-login link sharing on its free plan ($0 forever, no credit card required).
Frequently Asked Questions
Does my client need a Demoly account to search the video?
No. Clients can open the link in any modern web browser, watch the video, and use the search bar without creating an account or logging in.
What if I forgot to say a button name out loud while recording?
The video remains searchable. Demoly reads the visible on-screen text and recorded interface actions, so clients can search for words that appeared on screen even if you never spoke them.
Can the client download the video file directly?
By default, the walkthrough plays in the browser to preserve interactive search features. You can enable or disable MP4 downloads in the Share settings modal.
How long does it take for a recording to become searchable?
Processing typically takes under 30 to 60 seconds for a five-minute video. The search drawer activates as soon as video playback is ready.
Can I trim a mistake out of the walkthrough without breaking search?
Yes. If you trim an unwanted section in the editor, Demoly updates the video timeline and automatically realigns the search timestamps to match your new edit.

