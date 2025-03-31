import { executeGraphQLQuery } from './api';
import { GraphQLResponse } from './types';

export interface WorkflowTransition {
  id: string;
  name: string;
  from_status_id: string | null;
  to_status_id: string | null;
  core_dynamic_from_status?: {
    id: string;
    name: string;
    description?: string;
  };
  core_dynamic_to_status?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface WorkflowDetail {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  core_dynamic_workflow_transitions: WorkflowTransition[];
}

/**
 * Fetch detailed workflow information including all transitions and statuses
 * Chỉ lấy các transitions có deleted_at là null
 */
export async function fetchWorkflowDetails(workflowId: string): Promise<GraphQLResponse<{ core_core_dynamic_workflows_by_pk: WorkflowDetail }>> {
  const query = `
    query GetWorkflowDetails($workflowId: uuid!) {
      core_core_dynamic_workflows_by_pk(id: $workflowId) {
        description
        id
        name
        organization_id
        core_dynamic_workflow_transitions(where: {deleted_at: {_is_null: true}}) {
          from_status_id
          id
          to_status_id
          name
          core_dynamic_from_status {
            description
            id
            name
          }
          core_dynamic_to_status {
            description
            id
            name
          }
        }
      }
    }
  `;

  return executeGraphQLQuery(query, { workflowId });
}

/**
 * Generate Mermaid diagram syntax from workflow transitions
 */
export function generateMermaidDiagram(
  workflowDetail: WorkflowDetail,
  currentStatusId?: string
): string {
  // Nếu không có transitions, trả về diagram trống
  if (!workflowDetail?.core_dynamic_workflow_transitions?.length) {
    return 'graph LR\n  A[No workflow data]';
  }

  let mermaidSyntax = 'graph LR\n';
  
  // Tạo map để theo dõi tất cả các trạng thái duy nhất
  const statusMap = new Map<string, { id: string; name: string; style?: string }>();
  
  // Thêm các trạng thái từ transitions
  workflowDetail.core_dynamic_workflow_transitions.forEach(transition => {
    // Trạng thái nguồn (from)
    if (transition.from_status_id && transition.core_dynamic_from_status) {
      const fromStatusId = transition.from_status_id;
      statusMap.set(fromStatusId, {
        id: fromStatusId,
        name: transition.core_dynamic_from_status.name,
        style: fromStatusId === currentStatusId ? 'fill:#ffff00,stroke:#333,stroke-width:2' : undefined
      });
    }
    
    // Trạng thái đích (to)
    if (transition.to_status_id && transition.core_dynamic_to_status) {
      const toStatusId = transition.to_status_id;
      statusMap.set(toStatusId, {
        id: toStatusId,
        name: transition.core_dynamic_to_status.name,
        style: toStatusId === currentStatusId ? 'fill:#ffff00,stroke:#333,stroke-width:2' : undefined
      });
    }
  });
  
  // Thêm định nghĩa trạng thái vào cú pháp Mermaid
  statusMap.forEach(status => {
    const statusId = status.id.replace(/-/g, '_'); // Thay thế dấu - bằng _ để tránh lỗi cú pháp Mermaid
    mermaidSyntax += `  ${statusId}["${status.name}"]${status.style ? ` style ${statusId} ${status.style}` : ''}\n`;
  });
  
  // Thêm các chuyển tiếp
  workflowDetail.core_dynamic_workflow_transitions.forEach(transition => {
    if (transition.from_status_id && transition.to_status_id) {
      const fromId = transition.from_status_id.replace(/-/g, '_');
      const toId = transition.to_status_id.replace(/-/g, '_');
      mermaidSyntax += `  ${fromId} --> |${transition.name}| ${toId}\n`;
    } else if (!transition.from_status_id && transition.to_status_id) {
      // Trường hợp bắt đầu (không có trạng thái nguồn)
      const toId = transition.to_status_id.replace(/-/g, '_');
      mermaidSyntax += `  Start((Start)) --> |${transition.name}| ${toId}\n`;
    } else if (transition.from_status_id && !transition.to_status_id) {
      // Trường hợp kết thúc (không có trạng thái đích)
      const fromId = transition.from_status_id.replace(/-/g, '_');
      mermaidSyntax += `  ${fromId} --> |${transition.name}| End((End))\n`;
    }
  });
  
  return mermaidSyntax;
}