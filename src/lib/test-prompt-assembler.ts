// Test script to demonstrate the Prompt Assembler functionality
import { PromptAssembler } from './prompt-assembler';

// Sample data for testing
const sampleIntakeData = {
  business_idea: "An AI tool for generating social media content for small businesses",
  budget: "moderate" as const,
  challenges: ["Finding my target audience", "Creating compelling content"]
};

const sampleProfilingData = {
  audienceDetail: "Small business owners aged 25-45 who struggle with social media marketing and don't have time to create content consistently",
  outcomePreference: "revenue",
  tonePreference: "professional"
};

const sampleSelectedOptions = {
  1: "A", // Market-First Approach
  2: "B", // Behind-the-Scenes Content
  3: "A"  // Value-Led Website
};

// Create prompt assembler
const assembler = new PromptAssembler(sampleIntakeData, sampleProfilingData, sampleSelectedOptions);

// Generate prompts
console.log("=== BUSINESS CASE PROMPT ===");
console.log(assembler.generateBusinessCasePrompt());
console.log("\n=== CONTENT STRATEGY PROMPT ===");
console.log(assembler.generateContentStrategyPrompt());
console.log("\n=== WEBSITE CONTENT PROMPT ===");
console.log(assembler.generateWebsiteContentPrompt());
console.log("\n=== PERSONA PROMPT (DTC) ===");
console.log(assembler.generatePersonaPrompt("dtc"));
console.log("\n=== CONTEXT SUMMARY ===");
console.log(assembler.getContextSummary());

export { assembler };
