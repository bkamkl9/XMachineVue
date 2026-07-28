import type { AnyEvent, MachinePlugin, MachineSnapshot } from "../core/types";

export interface StorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem?: (key: string) => void;
}

export interface PersistenceOptions<
  TContext extends object,
  TState extends string,
> {
  key: string;
  storage?: StorageLike;
  version?: number;
  migrate?: (
    persisted: unknown,
    version: number | undefined,
  ) => Partial<MachineSnapshot<TContext, TState>> | undefined;
}

interface Persisted<TContext extends object, TState extends string> {
  version?: number;
  snapshot: MachineSnapshot<TContext, TState>;
}

/**
 * An opt-in browser-storage adapter. It is a no-op during SSR and validates
 * JSON before handing a snapshot to the actor.
 */
export function createPersistencePlugin<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
>(
  options: PersistenceOptions<TContext, TState>,
): MachinePlugin<TContext, TEvent, TState> {
  const storage =
    options.storage ??
    (typeof localStorage === "undefined" ? undefined : localStorage);
  return {
    hydrate: () => {
      if (!storage) return undefined;
      try {
        const raw = storage.getItem(options.key);
        if (!raw) return undefined;
        const persisted = JSON.parse(raw) as Persisted<TContext, TState>;
        if (!persisted || typeof persisted !== "object") return undefined;
        if (persisted.version !== options.version && options.migrate)
          return options.migrate(persisted, persisted.version);
        return persisted.version === options.version ||
          options.version === undefined
          ? persisted.snapshot
          : undefined;
      } catch {
        return undefined;
      }
    },
    onTransition: (record) => {
      if (!storage) return;
      const persisted: Persisted<TContext, TState> = {
        version: options.version,
        snapshot: record.snapshot,
      };
      storage.setItem(options.key, JSON.stringify(persisted));
    },
  };
}
