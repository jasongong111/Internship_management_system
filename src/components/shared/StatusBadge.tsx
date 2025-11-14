import { Badge } from '../ui/badge';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye,
  RotateCcw 
} from 'lucide-react';

export type Status = 
  | 'pending_approval'
  | 'approved'
  | 'disapproved'
  | 'pending_resubmission'
  | 'pending_assessment'
  | 'reviewed'
  | 'accepted'
  | 'rejected';

interface StatusBadgeProps {
  status: Status;
}

const statusConfig = {
  pending_approval: {
    label: 'Pending Approval',
    variant: 'secondary' as const,
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  approved: {
    label: 'Approved',
    variant: 'default' as const,
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800 border-green-300'
  },
  disapproved: {
    label: 'Disapproved',
    variant: 'destructive' as const,
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-300'
  },
  pending_resubmission: {
    label: 'Pending Resubmission',
    variant: 'secondary' as const,
    icon: RotateCcw,
    className: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  pending_assessment: {
    label: 'Pending Assessment',
    variant: 'secondary' as const,
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  reviewed: {
    label: 'Reviewed',
    variant: 'secondary' as const,
    icon: Eye,
    className: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  accepted: {
    label: 'Accepted',
    variant: 'default' as const,
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800 border-green-300'
  },
  rejected: {
    label: 'Rejected',
    variant: 'destructive' as const,
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-300'
  }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
