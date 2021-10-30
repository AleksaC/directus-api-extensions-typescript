import { Accountability, Query } from "@directus/shared/types";
import { ExtensionContext, SchemaOverview } from "directus/dist/types";

type Person = {
  id: number;
  name: string;
  last_name: string;
  age: number;
};

type EventInfo = {
  event: string;
  accountability: Accountability;
  collection: string;
  action: string;
  payload: unknown;
  schema: SchemaOverview;
  database: ExtensionContext["database"];
};

type WriteEventInfo = EventInfo & {
  item: string[] | null;
};

type ReadEventInfo = EventInfo & {
  query: Query;
};

function registerHook({ exceptions }: ExtensionContext) {
  const { InvalidPayloadException, ForbiddenException } = exceptions;

  return {
    "items.*": async function ({ accountability }: WriteEventInfo) {
      if (!accountability.admin) {
        throw new ForbiddenException();
      }
    },
    "items.create.before": async function (
      input: unknown,
      { collection }: EventInfo
    ) {
      if (collection !== "people") return input;

      const person = input as Person;

      if (person.age < 0) {
        throw new InvalidPayloadException("Age cannot be a negative number");
      }

      return person;
    },
    "items.read": ({ query }: ReadEventInfo) => {
      console.log(query);
    },
  };
}

export default registerHook;
