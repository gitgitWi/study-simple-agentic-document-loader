import type { PropsWithChildren } from 'preact/compat';
import { cn } from '~/utils/class-names';

export function DocumentsRoot({
  classNames,
  children,
}: PropsWithChildren<{ classNames?: string }>) {
  return (
    <div class={cn('flex flex-col gap-2 w-full', classNames)}>{children}</div>
  );
}
