// Import necessary functions
import { getAllProfessors, getProfessorsByDepartment } from './chat_commands/professorByDept.js';
import { getAIResponse } from './LLMConnector.js';

// Function to handle response when AI returns '1'
async function handleProfessorsLookup() {
    return await getAllProfessors();
}

// Function to handle response when AI returns '2'
function handleCoursesLookup() {
    return "Course look up function here";
}

// Function to handle response when AI returns '3'
async function handleGeneralInquiry(userPrompt) {
    const systemPrompt = "When asked about general college topics or specific queries regarding Kent State University, attempt to provide a clear, concise response within four sentences. If the question is too complex or requires more detailed or official information, advise the user to visit the official Kent State University website at https://www.kent.edu for more accurate information, or suggest contacting their academic advisor for personalized guidance.";
    return await getAIResponse(userPrompt, systemPrompt);
}

// Function to handle unknown responses
function handleUnknownResponse() {
    return "Unable to process, try again later";
}

// Main controller function
export async function responseSelector(aiResponse, userPrompt) {
    switch (aiResponse) {
        case '1':
            return await handleProfessorsLookup();
        case '2':
            return handleCoursesLookup();
        case '3':
            return await handleGeneralInquiry(userPrompt);
        default:
            return handleUnknownResponse();
    }
}
