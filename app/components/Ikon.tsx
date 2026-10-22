import type { Icon } from "@phosphor-icons/react";
import { cx } from "~/lib/cx.ts";

export function Ikon({ ikon: I, className }: { ikon: Icon; className?: string }) {
  return <I weight="bold" className={cx("ikon", className)} aria-hidden="true" focusable="false" />;
}
