/**
 * Google Gemini AI Integration
 * 
 * Provides intelligent, context-aware responses about the election
 * process using Google's Gemini generative AI model with carefully
 * crafted system prompts for accuracy and engagement.
 * 
 * @module utils/gemini
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { logger } = require('./logger');

// System prompt engineered for accurate, engaging election education
const SYSTEM_PROMPT = `You are "VoteGuide AI" — an expert, friendly, and non-partisan Election Process Education Assistant built to help citizens understand democratic elections clearly and accurately.

## Your Core Mission
Help users understand the complete election process including voter registration, election timelines, voting procedures, counting processes, and civic rights. Make complex electoral procedures simple, engaging, and accessible to everyone regardless of their education level.

## Knowledge Base — Indian Election Process

### Election Commission of India (ECI)
- Autonomous constitutional body under Article 324
- Headed by the Chief Election Commissioner and Election Commissioners
- Responsible for superintendence, direction, and control of elections
- Ensures free, fair, and transparent elections

### Types of Elections
1. **General Elections (Lok Sabha)**: Held every 5 years for 543 seats across India
2. **State Assembly Elections (Vidhan Sabha)**: Held every 5 years for state legislative assemblies
3. **By-Elections**: Fill vacant seats between general elections
4. **Local Body Elections**: Panchayat and Municipal elections

### Voter Registration
- **Eligibility**: Indian citizen, 18+ years old as of qualifying date (Jan 1, Apr 1, Jul 1, or Oct 1), ordinary resident of constituency
- **Form 6**: New voter registration
- **Form 8**: Corrections, address change, or replacement of EPIC card
- **Form 6A**: Overseas (NRI) voter registration
- **How to Register**: Online via voters.eci.gov.in, Voter Helpline App, or at BLO/Electoral Registration Officer
- **EPIC (Voter ID)**: Not mandatory if name is on electoral roll and alternative ID is available

### Election Timeline & Phases
1. **Announcement**: ECI announces election dates, Model Code of Conduct (MCC) comes into effect
2. **Nomination**: Candidates file nominations within stipulated period
3. **Scrutiny**: Returning Officer examines nominations for validity
4. **Withdrawal**: Last date for candidates to withdraw nominations
5. **Campaigning**: Political parties and candidates campaign (ends 48 hours before polling)
6. **Polling Day**: Voters cast ballots at designated polling stations
7. **Counting**: Votes are counted and results declared

### Model Code of Conduct (MCC)
- Comes into effect from announcement of election dates
- Prohibits use of government resources for campaigning
- Restricts hate speech and communal appeals
- Ensures level playing field for all parties

### Polling Day Process
1. Voter arrives at assigned polling station with valid ID
2. First polling officer verifies identity against electoral roll
3. Indelible ink applied to left index finger
4. Voter receives a signed slip after details recorded in Form 17A
5. Voter proceeds to voting compartment
6. Presses button on EVM (Electronic Voting Machine) next to chosen candidate
7. VVPAT slip displays candidate details for 7 seconds for verification
8. Voter exits polling station

### Electronic Voting Machine (EVM) & VVPAT
- **EVM**: Battery-operated, tamper-proof, records votes electronically
- **VVPAT**: Voter Verifiable Paper Audit Trail — prints paper slip confirming vote
- **VVPAT Matching**: Supreme Court mandates matching of 5 random VVPAT machines per assembly segment

### Counting & Results
1. EVMs stored in secured strongrooms under 24/7 surveillance
2. On counting day, strongrooms unsealed before Returning Officer and party agents
3. Postal ballots counted first
4. EVM counting begins 30 minutes later
5. Results announced round by round
6. Candidate with highest votes wins (First-Past-The-Post system)

### NOTA (None of the Above)
- Option on EVM since 2013 (Supreme Court directive)
- Allows voters to reject all candidates
- Even if NOTA gets most votes, the candidate with highest votes wins

### Key Electoral Reforms
- **Photo voter slips**: Distributed before elections
- **Accessible voting**: Braille-enabled EVMs, wheelchair ramps, volunteers for PwD voters
- **Postal ballots**: For armed forces, government officials on election duty, and senior citizens (85+)
- **Home voting**: For persons with disabilities (PwD) and senior citizens above 85

## Response Guidelines
1. **Accuracy First**: Only provide verified, factual information. If unsure, say so rather than guessing.
2. **Simple Language**: Use clear, everyday language. Avoid legal jargon unless explaining specific terms.
3. **Structured Responses**: Use bullet points, numbered lists, and headers for readability.
4. **Engaging Tone**: Be enthusiastic about democracy. Encourage civic participation.
5. **Non-Partisan**: Never favor any political party, candidate, or ideology.
6. **Inclusive**: Consider diverse audiences including first-time voters, senior citizens, PwD voters, and NRI voters.
7. **Actionable**: When relevant, provide specific steps users can take (e.g., how to register, where to vote).
8. **Scope**: Focus on the Indian election process. If asked about other countries, provide a brief comparison but redirect to the Indian context.
9. **Format**: Use emojis sparingly for friendliness (🗳️ ✅ 📋). Use markdown formatting for structure.
10. **Length**: Keep responses concise but comprehensive. Aim for 150-300 words unless the question requires more detail.`;

let genAI = null;
let model = null;

/**
 * Initialize the Gemini AI client
 * @returns {boolean} Whether initialization was successful
 */
function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    logger.warn('Gemini API key not configured. AI assistant will use fallback responses.');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    });
    logger.info('Google Gemini AI initialized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize Gemini:', { error: error.message });
    return false;
  }
}

/**
 * Generate a response from Gemini AI
 * @param {string} userMessage - The user's question about elections
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} The AI-generated response
 */
async function generateResponse(userMessage, conversationHistory = []) {
  if (!model) {
    initializeGemini();
  }

  if (!model) {
    return getFallbackResponse(userMessage);
  }

  try {
    // Build chat history for context
    const history = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    logger.info('Gemini response generated', { 
      inputLength: userMessage.length,
      outputLength: response.length,
    });

    return response;
  } catch (error) {
    logger.error('Gemini API error:', { error: error.message });
    
    if (error.message.includes('SAFETY')) {
      return "I'm sorry, I can only help with questions about the election process. Could you please rephrase your question?";
    }
    
    return getFallbackResponse(userMessage);
  }
}

/**
 * Provide intelligent fallback responses when Gemini is unavailable
 * @param {string} message - The user's message
 * @returns {string} A relevant fallback response
 */
function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  
  const fallbacks = [
    {
      keywords: ['register', 'registration', 'enroll', 'voter id', 'epic', 'form 6'],
      response: `## 📋 Voter Registration\n\nTo register as a voter in India, you need to:\n\n1. **Check Eligibility**: You must be an Indian citizen, 18+ years old\n2. **Fill Form 6**: Available online at [voters.eci.gov.in](https://voters.eci.gov.in) or via the Voter Helpline App\n3. **Submit Documents**: Proof of age, address, and identity\n4. **Verification**: A BLO (Booth Level Officer) will verify your details\n5. **Get EPIC**: Your Voter ID card will be issued after verification\n\n**Tip**: You can also register at your nearest Electoral Registration Office!\n\n*For corrections or address changes, use Form 8. NRI voters should use Form 6A.*`
    },
    {
      keywords: ['evm', 'voting machine', 'vvpat', 'how to vote', 'polling', 'booth'],
      response: `## 🗳️ How to Vote on Polling Day\n\n1. **Find Your Polling Station**: Check on the Voter Helpline App or voters.eci.gov.in\n2. **Carry Valid ID**: Voter ID (EPIC) or any government-issued photo ID\n3. **At the Station**:\n   - Your identity is verified against the electoral roll\n   - Indelible ink is applied to your left index finger\n   - You receive a signed voter slip\n4. **Cast Your Vote**: Press the button on the EVM next to your chosen candidate\n5. **Verify via VVPAT**: A paper slip shows your choice for 7 seconds\n6. **Exit**: Your vote is recorded securely!\n\n**Remember**: Voting is your democratic right and civic duty! 🇮🇳`
    },
    {
      keywords: ['count', 'result', 'winner', 'fptp', 'first past', 'strongroom'],
      response: `## 📊 Counting & Results\n\nAfter voting ends, here's what happens:\n\n1. **Secure Storage**: EVMs are sealed and stored in guarded strongrooms\n2. **Counting Day**: Strongrooms are opened before the Returning Officer and party agents\n3. **Postal Ballots First**: Postal votes are counted before EVM votes\n4. **EVM Counting**: Begins 30 minutes after postal ballot counting starts\n5. **Round-by-Round**: Results are announced in rounds for transparency\n6. **VVPAT Matching**: 5 random machines per assembly segment are verified\n7. **Winner Declaration**: Candidate with the most votes wins (FPTP system)\n\nThe entire process is monitored by observers and party representatives to ensure fairness.`
    },
    {
      keywords: ['timeline', 'schedule', 'phase', 'when', 'date', 'process', 'step'],
      response: `## 📅 Election Timeline\n\nThe Indian election process follows these key phases:\n\n1. **📢 Announcement** — ECI announces dates; Model Code of Conduct begins\n2. **📝 Nomination** — Candidates file papers with the Returning Officer\n3. **🔍 Scrutiny** — Nominations are examined for validity\n4. **🚫 Withdrawal** — Last date to withdraw candidature\n5. **📣 Campaigning** — Parties campaign (stops 48 hours before polling)\n6. **🗳️ Polling Day** — Citizens cast their votes\n7. **📊 Counting** — Votes counted; results declared\n\nGeneral Elections happen every **5 years** for the Lok Sabha (543 seats). State elections follow a similar process for Vidhan Sabha seats.`
    },
    {
      keywords: ['nota', 'reject', 'none of the above'],
      response: `## ❌ NOTA — None of the Above\n\nSince **2013** (following a Supreme Court directive), Indian voters have the option to choose **NOTA** on the EVM.\n\n- **What it means**: You can formally reject all candidates in your constituency\n- **How**: Press the last button on the EVM marked "NOTA"\n- **Effect**: Even if NOTA gets the highest votes, the candidate with the most votes among contestants wins\n- **Significance**: It sends a strong message about voter dissatisfaction with available choices\n\nNOTA empowers you to participate in democracy even when no candidate meets your expectations!`
    },
    {
      keywords: ['mcc', 'model code', 'code of conduct', 'campaign', 'rules'],
      response: `## ⚖️ Model Code of Conduct (MCC)\n\nThe MCC is a set of guidelines for political parties and candidates during elections:\n\n- **Effective From**: The moment ECI announces election dates\n- **Key Rules**:\n  - No use of government resources for campaigning\n  - No communal or divisive appeals\n  - No distribution of money or gifts to voters\n  - Campaign silence 48 hours before polling\n  - Equal access to public spaces for all parties\n- **Enforcement**: ECI monitors compliance; violators face action\n\nThe MCC ensures a **level playing field** and fair elections for all participants.`
    },
    {
      keywords: ['eci', 'election commission', 'who conducts', 'authority'],
      response: `## 🏛️ Election Commission of India (ECI)\n\nThe ECI is the **autonomous constitutional body** that conducts elections in India.\n\n- **Constitutional Basis**: Article 324 of the Indian Constitution\n- **Composition**: Chief Election Commissioner + Election Commissioners\n- **Responsibilities**:\n  - Superintendence, direction, and control of elections\n  - Preparing and updating electoral rolls\n  - Scheduling elections and enforcing MCC\n  - Ensuring free, fair, and transparent elections\n  - Registering political parties\n- **Independence**: Functions independently of the government\n\nThe ECI has conducted elections for the world's largest democracy since 1950! 🇮🇳`
    },
  ];

  for (const fb of fallbacks) {
    if (fb.keywords.some(kw => lower.includes(kw))) {
      return fb.response;
    }
  }

  return `## 🗳️ Welcome to VoteGuide AI!\n\nI'm here to help you understand the election process. Here are some topics I can help with:\n\n- 📋 **Voter Registration** — How to register, required documents\n- 📅 **Election Timeline** — Phases and schedule of elections\n- 🗳️ **How to Vote** — Step-by-step polling day guide\n- 📊 **Counting & Results** — How votes are counted\n- ⚖️ **Model Code of Conduct** — Rules for fair elections\n- 🏛️ **Election Commission** — Role and responsibilities of ECI\n- ❌ **NOTA** — The "None of the Above" option\n\nAsk me anything about elections! I'm here to make civic education simple and engaging. 😊`;
}

// Initialize on module load
initializeGemini();

module.exports = { generateResponse, initializeGemini, getFallbackResponse };
