import { ReactNode } from 'react';

export function Empty({
  message,
  title,
  description,
  action,
}: {
  message?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  const content = message || description || '';
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center">
      {title ? <p className="text-lg font-semibold">{title}</p> : null}
      {content ? <p>{content}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
