import path from "path";
import prompts, { PromptObject } from "prompts";
import { assertIsKnownEntity } from "./entity";
import UserSearch from "./entity-search/user-search";
import Search from "./search";

const questions: PromptObject[] = [
  {
    type: "select",
    name: "entity",
    message: "What would you like to search for?",
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
  },
  {
    type: "text",
    name: "term",
    message: "Enter your search term",
  },
];

(async () => {
  const search = new Search();
  await search.readDataFiles(path.resolve(__dirname, "..", "data"));

  console.info("\n- Welcome to ticket search\n- To exit, press Ctrl+C\n");
  nextCommand();

  async function nextCommand() {
    const { entity, field, term } = await prompts(questions, {
      onCancel: () => {
        console.info("- Bye");
        process.exit();
      },
    });
    const result = search.search(entity, field, term);
    console.log(entity, field, term);
    console.log(result);

    process.nextTick(nextCommand);
  }
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
