import path from "path";
import prompts, { PromptObject } from "prompts";
import { assertIsKnownEntity } from "./entity";
import UserSearch from "./entity-search/user-search";
import Search from "./search";

const questions: PromptObject[] = [
  {
    type: "select",
    name: "entity",
    message: "What would you like to search?",
    choices: [
      { title: "User", value: "user" },
      { title: "Ticket", value: "ticket" },
      { title: "Organization", value: "organization" },
    ],
    initial: 0,
  },
  {
    type: "autocomplete",
    limit: 20,
    name: "field",
    message: "Choose a data field. Start typing to autocomplete.",
    // @ts-expect-error
    fallback: "No matches. Please clear input to see options.",
    choices: entityFields,
    clearFirst: true,
  },
  {
    type: "text",
    name: "term",
    message: "Please enter your search term",
  },
];

(async () => {
  const { entity, field, term } = await prompts(questions);

  const search = new Search();
  await search.readDataFiles(path.resolve(__dirname, "..", "data"));
  const result = search.search(entity, field, term);
  console.log(entity, field, term);
  console.log(result);
})();

function entityFields(entity: string) {
  assertIsKnownEntity(entity);

  let fields;
  switch (entity) {
    case "user":
      fields = UserSearch.Fields.keys();
    case "ticket":
      fields = UserSearch.Fields.keys();
    case "organization":
      fields = UserSearch.Fields.keys();
  }

  return [...fields].map((field) => ({ title: field }));
}
