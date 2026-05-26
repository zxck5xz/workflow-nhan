import React, { useState } from 'react';
import { Button, Modal } from '.';
import './PageHelp.css';

export function PageHelp({ title, children, buttonLabel = '❓ Hướng dẫn' }: { title: string; children: React.ReactNode; buttonLabel?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="page-help">
      <Button variant="ghost" onClick={() => setOpen(true)}>{buttonLabel}</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title={title} footer={<Button onClick={() => setOpen(false)}>Đóng</Button>}>
        <div className="page-help-content">
          {children}
        </div>
      </Modal>
    </div>
  );
}

export default PageHelp;
