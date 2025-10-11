import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

const ConversationSchema = z.object({
  message: z.string(),
  conversationId: z.string().optional(),
  step: z.enum(['start', 'continue']),
  initialBusinessIdea: z.string().optional(),
});

interface ConversationStep {
  question: string;
  field: string;
  followUps?: string[];
  required: boolean;
}

const conversationFlow: ConversationStep[] = [
  {
    question: "What's your business idea? Tell me about the product or service you want to create.",
    field: "businessIdea",
    required: true,
  },
  {
    question: "Who's your ideal customer? What's their age, profession, and biggest pain point?",
    field: "targetAudience",
    required: true,
  },
  {
    question: "What problem does your business solve? How does it make your customer's life better?",
    field: "problemSolution",
    required: true,
  },
  {
    question: "How do you plan to make money? What's your pricing model?",
    field: "revenueModel",
    required: true,
  },
  {
    question: "Who are your main competitors? What makes you different from them?",
    field: "competitiveAdvantage",
    required: true,
  },
  {
    question: "When do you want to launch? What's your timeline?",
    field: "timeline",
    required: true,
  },
  {
    question: "What's your biggest challenge right now? What do you need help with most?",
    field: "biggestChallenge",
    required: true,
  },
  {
    question: "What does success look like for you? What's your goal in 6 months?",
    field: "successGoals",
    required: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId, step, initialBusinessIdea } = ConversationSchema.parse(body);

    // Generate a new conversation ID if starting
    const currentConversationId = conversationId || crypto.randomUUID();

    if (step === 'start') {
      // If we have an initial business idea, skip the first question
      if (initialBusinessIdea) {
        // Store the business idea as the first step
        const { error: upsertError } = await supabaseAdmin
          .from('intake_conversations')
          .upsert({
            conversation_id: currentConversationId,
            gathered_data: { businessIdea: initialBusinessIdea },
            completed_steps: ['businessIdea'],
            is_complete: false,
          }, { onConflict: 'conversation_id' });

        if (upsertError) {
          console.error('Error storing initial business idea:', upsertError);
        }

        return NextResponse.json({
          conversationId: currentConversationId,
          nextQuestion: conversationFlow[1].question, // Skip first question
          progress: 1 / conversationFlow.length,
          isComplete: false,
          gatheredData: { businessIdea: initialBusinessIdea },
        });
      } else {
        return NextResponse.json({
          conversationId: currentConversationId,
          nextQuestion: conversationFlow[0].question,
          progress: 0,
          isComplete: false,
          gatheredData: {},
        });
      }
    }

    // Get existing conversation data from database
    console.log('Fetching conversation for ID:', currentConversationId);
    const { data: existingConversation, error: fetchError } = await supabaseAdmin
      .from('intake_conversations')
      .select('*')
      .eq('conversation_id', currentConversationId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Database fetch error:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
    } else {
      console.log('Existing conversation:', existingConversation);
    }

    // Initialize conversation data if it doesn't exist
    const conversationData = existingConversation || {
      conversation_id: currentConversationId,
      gathered_data: {},
      completed_steps: [],
      is_complete: false,
    };
    
    // Determine current step based on gathered data
    const currentStepIndex = conversationData.completed_steps.length;
    
    if (currentStepIndex >= conversationFlow.length) {
      return NextResponse.json({
        conversationId: currentConversationId,
        isComplete: true,
        progress: 1,
        gatheredData: conversationData.gathered_data,
      });
    }

    const currentStep = conversationFlow[currentStepIndex];
    
    // Store the user's response
    const updatedGatheredData = {
      ...conversationData.gathered_data,
      [currentStep.field]: message,
    };
    const updatedCompletedSteps = [...conversationData.completed_steps, currentStep.field];
    
    // Calculate progress
    const progress = (currentStepIndex + 1) / conversationFlow.length;
    
    // Determine next question
    let nextQuestion = '';
    if (currentStepIndex + 1 < conversationFlow.length) {
      nextQuestion = conversationFlow[currentStepIndex + 1].question;
    }

    // Store updated conversation data in database
    const { error: upsertError } = await supabaseAdmin
      .from('intake_conversations')
      .upsert({
        conversation_id: currentConversationId,
        gathered_data: updatedGatheredData,
        completed_steps: updatedCompletedSteps,
        is_complete: currentStepIndex + 1 >= conversationFlow.length,
      }, { onConflict: 'conversation_id' });

    if (upsertError) {
      console.error('Error storing conversation:', upsertError);
      return NextResponse.json({ error: 'Failed to store conversation' }, { status: 500 });
    }

    return NextResponse.json({
      conversationId: currentConversationId,
      nextQuestion,
      progress,
      isComplete: currentStepIndex + 1 >= conversationFlow.length,
      gatheredData: updatedGatheredData,
    });

  } catch (error) {
    console.error('Conversation API Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    // Provide more detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detailed error:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

