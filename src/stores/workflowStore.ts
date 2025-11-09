import { create } from "zustand";

export type WorkflowType = "blog" | "linkedin" | "calendar";
export type StageType = "input" | "selection" | "processing" | "approval" | "editor";
export type StageStatus = "completed" | "in-progress" | "pending";

export interface WorkflowStep {
  id: string;
  name: string;
  status: StageStatus;
}

export interface WorkflowStage {
  id: string;
  stepId: string; // Maps to the timeline step.id
  title: string;
  description: string;
  type: StageType;
  canGoBack: boolean;
  primaryAction: string;
  // For selection stages
  options?: Array<{ id: string; title: string; description: string }>;
  multiSelect?: boolean;
  selectedOptions?: string[];
  // For input stages
  inputLabel?: string;
  placeholder?: string;
  inputValue?: string;
  allowFileUpload?: boolean;
  acceptedFiles?: string;
  uploadedFiles?: File[];
  // For processing stages
  processingStage?: string;
  progress?: number;
  message?: string;
}

export interface WorkflowState {
  isActive: boolean;
  workflowType: WorkflowType | null;
  currentStageIndex: number;
  steps: WorkflowStep[];
  stages: WorkflowStage[];
  
  // Editor state
  editorContent: string;
  editorTitle: string;
  brief: {
    title: string;
    wordCount: number;
    readingTime: number;
    keywords: string[];
  } | null;
  
  // Actions
  startWorkflow: (type: WorkflowType) => void;
  pauseWorkflow: () => void;
  nextStage: () => void;
  previousStage: () => void;
  updateStageData: (data: Partial<WorkflowStage>) => void;
  updateEditorContent: (content: string) => void;
  updateEditorTitle: (title: string) => void;
  completeStage: () => void;
  insertIntoInput: (content: string, position: "replace" | "append" | "prepend") => void;
}

const blogWorkflowStages: WorkflowStage[] = [
  {
    id: "input",
    stepId: "input",
    title: "What would you like to write about?",
    description: "Share your topic, key ideas, or upload supporting documents",
    type: "input",
    canGoBack: false,
    primaryAction: "Continue",
    inputLabel: "Topic or Brief",
    placeholder: "e.g., 'AI in Healthcare: How machine learning is revolutionizing patient care'",
    inputValue: "",
    allowFileUpload: true,
    acceptedFiles: ".pdf,.doc,.docx,.txt",
    uploadedFiles: [],
  },
  {
    id: "research",
    stepId: "research",
    title: "Researching your topic...",
    description: "Our AI is gathering relevant information and analyzing trends",
    type: "processing",
    canGoBack: false,
    primaryAction: "Continue",
    processingStage: "Research",
    progress: 0,
    message: "Analyzing market data and gathering insights...",
  },
  {
    id: "topics",
    stepId: "topics",
    title: "Choose your angle",
    description: "Select the topic angle that best fits your goals",
    type: "selection",
    canGoBack: true,
    primaryAction: "Continue",
    multiSelect: false,
    options: [
      {
        id: "angle1",
        title: "The Transformation Story",
        description: "How AI is fundamentally changing healthcare delivery and patient outcomes",
      },
      {
        id: "angle2",
        title: "The Practical Guide",
        description: "5 ways healthcare providers can implement AI today",
      },
      {
        id: "angle3",
        title: "The Future Vision",
        description: "What healthcare will look like in 2030 with AI integration",
      },
      {
        id: "angle4",
        title: "The Case Study Approach",
        description: "Real-world examples of AI success in major hospitals",
      },
    ],
    selectedOptions: [],
  },
  {
    id: "brief-generation",
    stepId: "brief",
    title: "Creating your content brief...",
    description: "Building a structured outline and research brief",
    type: "processing",
    canGoBack: false,
    primaryAction: "Continue",
    processingStage: "Brief Generation",
    progress: 0,
    message: "Structuring your content outline...",
  },
  {
    id: "brief-approval",
    stepId: "brief",
    title: "Review your content brief",
    description: "Approve or request changes to the outline",
    type: "approval",
    canGoBack: true,
    primaryAction: "Approve & Continue",
  },
];

const linkedinWorkflowStages: WorkflowStage[] = [
  {
    id: "input",
    stepId: "input",
    title: "What's your LinkedIn post about?",
    description: "Share your message, insight, or announcement",
    type: "input",
    canGoBack: false,
    primaryAction: "Continue",
    inputLabel: "Your Message",
    placeholder: "e.g., 'Just launched our new AI feature that helps teams save 10 hours per week'",
    inputValue: "",
    allowFileUpload: false,
  },
  {
    id: "enhancement",
    stepId: "enhance",
    title: "Enhancing your post...",
    description: "Optimizing for engagement and adding hooks",
    type: "processing",
    canGoBack: false,
    primaryAction: "Continue",
    processingStage: "Enhancement",
    progress: 0,
    message: "Crafting compelling hooks and hashtags...",
  },
  {
    id: "tone-selection",
    stepId: "tone",
    title: "Choose your tone",
    description: "Select the voice that matches your brand",
    type: "selection",
    canGoBack: true,
    primaryAction: "Continue",
    multiSelect: false,
    options: [
      {
        id: "professional",
        title: "Professional & Authoritative",
        description: "Establish thought leadership with a formal, expert tone",
      },
      {
        id: "conversational",
        title: "Conversational & Friendly",
        description: "Build connections with an approachable, relatable voice",
      },
      {
        id: "inspiring",
        title: "Inspiring & Motivational",
        description: "Energize your audience with uplifting, action-oriented language",
      },
    ],
    selectedOptions: [],
  },
  {
    id: "post-generation",
    stepId: "generate",
    title: "Generating your post...",
    description: "Creating optimized content for LinkedIn",
    type: "processing",
    canGoBack: false,
    primaryAction: "Continue",
    processingStage: "Generation",
    progress: 0,
    message: "Finalizing your LinkedIn post...",
  },
];

const calendarWorkflowStages: WorkflowStage[] = [
  {
    id: "calendar-selection",
    stepId: "select",
    title: "Select from your content calendar",
    description: "Choose a scheduled topic to create content for",
    type: "selection",
    canGoBack: false,
    primaryAction: "Continue",
    multiSelect: false,
    options: [
      {
        id: "event1",
        title: "Product Launch Announcement",
        description: "Scheduled for tomorrow • Blog post about new features",
      },
      {
        id: "event2",
        title: "Industry Trends Report",
        description: "Due in 3 days • Analysis of Q1 2025 market shifts",
      },
      {
        id: "event3",
        title: "Customer Success Story",
        description: "Due next week • Case study with Acme Corp",
      },
    ],
    selectedOptions: [],
  },
  {
    id: "research",
    stepId: "prepare",
    title: "Preparing your content...",
    description: "Gathering context and related materials",
    type: "processing",
    canGoBack: false,
    primaryAction: "Continue",
    processingStage: "Preparation",
    progress: 0,
    message: "Loading calendar details and references...",
  },
  {
    id: "input",
    stepId: "input",
    title: "Add additional context",
    description: "Include any specific points or requirements",
    type: "input",
    canGoBack: true,
    primaryAction: "Continue",
    inputLabel: "Additional Details",
    placeholder: "e.g., 'Emphasize the 50% performance improvement and include customer quotes'",
    inputValue: "",
    allowFileUpload: true,
    acceptedFiles: ".pdf,.doc,.docx,.txt",
  },
  {
    id: "brief-generation",
    stepId: "brief",
    title: "Creating your content brief...",
    description: "Building outline based on calendar event",
    type: "processing",
    canGoBack: false,
    primaryAction: "Continue",
    processingStage: "Brief Generation",
    progress: 0,
    message: "Structuring your content...",
  },
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  isActive: false,
  workflowType: null,
  currentStageIndex: 0,
  steps: [],
  stages: [],
  editorContent: "",
  editorTitle: "",
  brief: null,

  startWorkflow: (type) => {
    let stages: WorkflowStage[] = [];
    let steps: WorkflowStep[] = [];

    if (type === "blog") {
      stages = blogWorkflowStages;
      steps = [
        { id: "input", name: "Input", status: "in-progress" },
        { id: "research", name: "Research", status: "pending" },
        { id: "topics", name: "Topics", status: "pending" },
        { id: "brief", name: "Brief", status: "pending" },
        { id: "content", name: "Content", status: "pending" },
      ];
    } else if (type === "linkedin") {
      stages = linkedinWorkflowStages;
      steps = [
        { id: "input", name: "Input", status: "in-progress" },
        { id: "enhance", name: "Enhance", status: "pending" },
        { id: "tone", name: "Tone", status: "pending" },
        { id: "generate", name: "Generate", status: "pending" },
      ];
    } else if (type === "calendar") {
      stages = calendarWorkflowStages;
      steps = [
        { id: "select", name: "Select", status: "in-progress" },
        { id: "prepare", name: "Prepare", status: "pending" },
        { id: "input", name: "Input", status: "pending" },
        { id: "brief", name: "Brief", status: "pending" },
      ];
    }

    set({
      isActive: true,
      workflowType: type,
      currentStageIndex: 0,
      steps,
      stages,
    });
  },

  pauseWorkflow: () => {
    set({
      isActive: false,
      workflowType: null,
      currentStageIndex: 0,
      steps: [],
      stages: [],
    });
  },

  nextStage: () => {
    const { currentStageIndex, stages, steps } = get();
    if (currentStageIndex < stages.length - 1) {
      const nextIndex = currentStageIndex + 1;
      const currentStage = stages[currentStageIndex];
      const nextStage = stages[nextIndex];
      
      // Update step statuses based on stepId mapping
      const updatedSteps = [...steps];
      const currentStepIndex = steps.findIndex(s => s.id === currentStage.stepId);
      const nextStepIndex = steps.findIndex(s => s.id === nextStage.stepId);
      
      // Only mark current step as complete if moving to a DIFFERENT step
      if (nextStepIndex !== currentStepIndex && currentStepIndex !== -1 && nextStepIndex !== -1) {
        updatedSteps[currentStepIndex].status = "completed";
        updatedSteps[nextStepIndex].status = "in-progress";
      }
      
      set({ currentStageIndex: nextIndex, steps: updatedSteps });
      
      // Auto-start processing stages
      if (nextStage.type === "processing") {
        setTimeout(() => get().completeStage(), 100);
      }
    }
  },

  previousStage: () => {
    const { currentStageIndex, stages, steps } = get();
    if (currentStageIndex > 0) {
      const prevIndex = currentStageIndex - 1;
      const currentStage = stages[currentStageIndex];
      const prevStage = stages[prevIndex];
      
      // Update step statuses based on stepId mapping
      const updatedSteps = [...steps];
      const currentStepIndex = steps.findIndex(s => s.id === currentStage.stepId);
      const prevStepIndex = steps.findIndex(s => s.id === prevStage.stepId);
      
      // Only update step status if moving to a DIFFERENT step
      if (prevStepIndex !== currentStepIndex && currentStepIndex !== -1 && prevStepIndex !== -1) {
        updatedSteps[currentStepIndex].status = "pending";
        updatedSteps[prevStepIndex].status = "in-progress";
      }
      
      set({ currentStageIndex: prevIndex, steps: updatedSteps });
    }
  },

  updateStageData: (data) => {
    const { currentStageIndex, stages } = get();
    const updatedStages = [...stages];
    updatedStages[currentStageIndex] = {
      ...updatedStages[currentStageIndex],
      ...data,
    };
    set({ stages: updatedStages });
  },

  updateEditorContent: (content) => {
    set({ editorContent: content });
  },

  updateEditorTitle: (title) => {
    set({ editorTitle: title });
  },

  completeStage: () => {
    const { currentStageIndex, stages } = get();
    const currentStage = stages[currentStageIndex];

    // Simulate processing for processing stages
    if (currentStage.type === "processing") {
      const interval = setInterval(() => {
        const stage = get().stages[currentStageIndex];
        const progress = stage.progress || 0;
        
        if (progress >= 100) {
          clearInterval(interval);
          get().nextStage();
        } else {
          get().updateStageData({ progress: progress + 10 });
        }
      }, 300);
    } else {
      get().nextStage();
    }
  },

  insertIntoInput: (content, position) => {
    const { currentStageIndex, stages } = get();
    const currentStage = stages[currentStageIndex];
    
    if (currentStage?.type === "input") {
      const currentValue = currentStage.inputValue || "";
      let newValue = "";
      
      switch (position) {
        case "replace":
          newValue = content;
          break;
        case "append":
          newValue = currentValue + (currentValue ? "\n\n" : "") + content;
          break;
        case "prepend":
          newValue = content + (currentValue ? "\n\n" : "") + currentValue;
          break;
      }
      
      get().updateStageData({ inputValue: newValue });
    }
  },
}));
