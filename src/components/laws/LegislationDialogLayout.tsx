import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LegislationDialogLayoutProps {
  title: string;
  description: ReactNode;
  children: ReactNode;
  onClose: () => void;
  dialogFooter?: ReactNode;
}

export function LegislationDialogLayout({ 
  title, 
  description, 
  children, 
  onClose, 
  dialogFooter 
}: LegislationDialogLayoutProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl pr-8">{title}</DialogTitle>
          <DialogDescription className="flex items-center gap-4 min-h-[24px]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6">
          {children}
        </ScrollArea>
        {dialogFooter && (
          <div className="p-6 pt-4 border-t">
            {dialogFooter}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}