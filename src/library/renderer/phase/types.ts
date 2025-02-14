import usePhase from ".";

export enum Phase {
  Uninitialised = 1,
  InvokedController = 2,
}

export type UsePhase = ReturnType<typeof usePhase>;
