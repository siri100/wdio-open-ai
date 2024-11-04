import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: 'xxxxxxxxxxxxx',
});

async function getCommandFromChatGPT(userPrompt: string, pageSource: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an assistant that provides commands in JSON format." },
                {
                    role: "user",
                    content: `Analyze this prompt: "${userPrompt}" along with the HTML source provided. Return a JSON object in this format, no additional text, JSON ONLY!:\n\n{
                      "action": "fill" or "click" or "validate",
                      "target": "<XPATH selector>",
                      "expectedValue": "<expected text if action is 'validate'>",
                      "value": "<text to fill, if action is 'fill'>"
                    }\n\nIf possible, avoid overly complex paths and prioritize resource IDs, text, or content descriptions where available. HTML:\n${pageSource}`
                }
            ]
        });
        const content = response.choices[0].message?.content?.replace(/```json|```/g, '').trim();
        if (!content) throw new Error("Invalid response from OpenAI API");

        const command = JSON.parse(content);
        if (
            command.action &&
            command.target &&
            (command.action === "click" || command.action === "fill" || (command.action === "validate" && command.expectedValue))
        ) {
            console.log("Valid command:", command);
            return command;
        } else {
            throw new Error("Invalid command structure");
        }
    } catch (error) {
        console.error("Error processing command from ChatGPT:", error);
        return null;
    }
}

async function executeCommand(
    command: { action: string; target: string; expectedValue?: string; value?: string },
    pageSource: string
) {
    const element = await $(command.target);
    await element.waitForDisplayed({ timeout: 2000 });

    const actions = {
        fill: async () => {
            if (command.value) {
                await element.setValue(command.value);
                console.log(`Filled ${command.target} with ${command.value}`);
            }
        },
        click: async () => {
            await element.click();
            await driver.waitUntil(
                async () => (await driver.getPageSource()) !== pageSource,
                { timeout: 2000, timeoutMsg: 'Page source did not change after click.' }
            );
            console.log(`Clicked ${command.target}`);
        },
        validate: async () => {
            if (command.expectedValue) {
                const actualText = await element.getText();
                if (actualText === command.expectedValue) {
                    console.log(`Validation successful: ${command.target} contains "${actualText}"`);
                } else {
                    console.error(`Validation failed: Expected "${command.expectedValue}", but found "${actualText}"`);
                    throw new Error(`Validation failed for ${command.target}: expected "${command.expectedValue}", but found "${actualText}"`);
                }
            }
        }
    };

    // Execute the action if it exists, or log an error if it doesn't
    const action = actions[command.action as keyof typeof actions];
    if (action) {
        await action();
    } else {
        console.log("Unknown action:", command.action);
    }
}




export async function ai(userPrompt: string) {
    console.log(userPrompt);
    await driver.pause(5000)
    let pageSource = await driver.getPageSource();
    let command = await getCommandFromChatGPT(userPrompt, pageSource);
    console.log(command);
    await executeCommand(command, pageSource)
}

