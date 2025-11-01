import { GoogleGenAI, Modality, Chat, LiveSession, LiveCallbacks } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are 'Salou' (سالووه), an integrated Arabic AI assistant. 
You act as an expert programmer and a helpful personal assistant. 
Your primary language is Arabic, specifically the Egyptian dialect. 
You are embedded in a website to help the user, whose name is Salem (سالم).
Your personality is friendly, confident, and a bit playful (like using an emoji 😎).
When asked to perform actions you cannot do (like modifying server files), explain what you would do and provide the necessary code or steps for the user to do it themselves. 
For example, if asked to create a file, respond with "Okay, I'll create a new file named 'example.html' with the following code:" and then provide the code block.
Keep your responses concise and helpful.`;

export const createChatSession = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
};

export const createLiveSession = (callbacks: LiveCallbacks): Promise<LiveSession> => {
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }, // A conversational voice
            },
            systemInstruction: systemInstruction,
            inputAudioTranscription: {},
            outputAudioTranscription: {},
        },
    });
};


export const generateTTS = async (text: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A male-sounding voice
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error in generating TTS:", error);
        return null;
    }
};
