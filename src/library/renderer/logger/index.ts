import { Module } from "../../types/index.ts";
import { AnalysePassProps, FinalPassProps, OptimisticPassProps, Props } from "./types.ts";
import { getColour } from "./utils.ts";
import * as React from "react";

export default function useLogger<M extends Module>(props: Props<M>) {
  return React.useMemo(
    () => ({
      renderPass(): void {
        const colour = getColour();

        if (props.elements.shadowBoundary.current) {
          const node = props.elements.customElement.current;

          console.group(
            `Marea / %crender pass`,
            `background: #${colour}; color: white; border-radius: 2px; padding: 0 4px`,
          );
          console.groupCollapsed(node);
          console.log("Node", node);
          console.groupEnd();
          console.groupEnd();
        }
      },
      analysePass({ event, payload, io, duration, mutations }: AnalysePassProps): void {
        const colour = getColour();

        console.group(
          `Marea / %canalyse pass`,
          `background: #${colour}; color: white; border-radius: 2px; padding: 0 4px`,
        );
        console.groupCollapsed(props.elements.customElement.current);
        console.log("Node", props.elements.customElement.current);
        console.log("Event", event, payload);
        console.log("Time", `${performance.now() - duration}ms`);
        console.log("Actions", [...io]);
        console.log("Mutations", mutations);
        console.groupEnd();
        console.groupEnd();
      },
      optimisticPass({ event, payload, io, duration, mutations }: OptimisticPassProps) {
        const colour = getColour();

        console.group(
          `Marea / %coptimistic pass`,
          `background: #${colour}; color: white; border-radius: 2px; padding: 0 4px`,
        );
        console.groupCollapsed(props.elements.customElement.current);
        console.log("Node", props.elements.customElement.current);
        console.log("Event", event, payload);
        console.log("Time", `${performance.now() - duration}ms`);
        console.log("Actions", [...io]);
        console.log("Mutations", mutations);
        console.groupEnd();
        console.groupEnd();
      },
      finalPass({ event, model, duration }: FinalPassProps) {
        const colour = getColour();

        console.group(
          `Marea / %cfinal pass`,
          `background: #${colour}; color: white; border-radius: 2px; padding: 0 4px`,
        );
        console.groupCollapsed(props.elements.customElement.current);
        console.log("Event", event);

        if (duration) {
          console.log("Time", `${performance.now() - duration}ms`);
        }

        console.log("Model", model.current);
        console.groupEnd();
        console.groupEnd();
      },
    }),
    [],
  );
}
