"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { List, X } from "@phosphor-icons/react/ssr";

const subscribeToHydration = () => () => {};

/** Native dialog supplies focus containment, Escape and an inert background. */
export function AppNavigationDrawer({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  function close() { dialog.current?.close(); trigger.current?.focus(); }
  return <>
    <button ref={trigger} type="button" className="app-menu-trigger" disabled={!ready} data-navigation-ready={ready} aria-label="Abrir menu do aplicativo" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}><List size={24} aria-hidden="true" /></button>
    <dialog ref={dialog} className="app-navigation-dialog" aria-label="Menu do aplicativo" onClick={event => { if (event.target === event.currentTarget) close(); }} onClose={() => trigger.current?.focus()}>
      <div className="app-navigation-drawer" onClick={event => { if ((event.target as HTMLElement).closest("a")) dialog.current?.close(); }}>
        <button type="button" className="app-menu-close" aria-label="Fechar menu do aplicativo" onClick={close}><X size={23} aria-hidden="true" /></button>
        {children}
      </div>
    </dialog>
  </>;
}
