export type CopilotEventType = "thought" | "tool_call" | "observation" | "final_answer";

export interface CopilotEvent {
  type: CopilotEventType;
  content?: string;
  tool?: string;
  args?: Record<string, any>;
  result?: string;
}
