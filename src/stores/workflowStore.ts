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
}

const blogWorkflowStages: WorkflowStage[] = [
  {
    id: "input",
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
    title: "Review your content brief",
    description: "Approve or request changes to the outline",
    type: "approval",
    canGoBack: true,
    primaryAction: "Approve & Continue",
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
    const stages = type === "blog" ? blogWorkflowStages : [];
    const steps: WorkflowStep[] = [
      { id: "input", name: "Input", status: "in-progress" },
      { id: "research", name: "Research", status: "pending" },
      { id: "topics", name: "Topics", status: "pending" },
      { id: "brief", name: "Brief", status: "pending" },
      { id: "content", name: "Content", status: "pending" },
    ];

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
    const { currentStageIndex, stages } = get();
    if (currentStageIndex < stages.length - 1) {
      set({ currentStageIndex: currentStageIndex + 1 });
    }
  },

  previousStage: () => {
    const { currentStageIndex } = get();
    if (currentStageIndex > 0) {
      set({ currentStageIndex: currentStageIndex - 1 });
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
    const { currentStageIndex, steps, stages } = get();
    const updatedSteps = [...steps];
    
    if (currentStageIndex < steps.length - 1) {
      updatedSteps[currentStageIndex].status = "completed";
      updatedSteps[currentStageIndex + 1].status = "in-progress";
    }

    // Simulate processing for processing stages
    const currentStage = stages[currentStageIndex];
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

    set({ steps: updatedSteps });
  },
}));
