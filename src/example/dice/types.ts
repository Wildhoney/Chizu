export type Model = {
  kite: number;
};

export const enum Events {
  Roll,
}

export type Actions = [Events.Roll];

export type Props = {
  initialKite: string;
};
