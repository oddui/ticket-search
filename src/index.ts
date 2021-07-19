import path from "path";
import prompts, { PromptObject } from "prompts";
import { assertIsKnownEntity } from "./entity";
import { organizationFields } from "./entity-search/organization-search";
import { ticketFields } from "./entity-search/ticket-search";
import { userFields } from "./entity-search/user-search";
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

    try {
      const result = search.search(entity, field, term);
      // TODO: display result
      console.log(result);
      console.info(`- ${result.length} result(s)`);
    } catch (e) {
      console.info(`- Failed to search. Reason: ${e.message}.`);
    }

    process.nextTick(nextCommand);
  }
})();

function entityFields(entity: string) {
  assertIsKnownEntity(entity);

  let fields;
  switch (entity) {
    case "user":
      fields = userFields.keys();
      break;
    case "ticket":
      fields = ticketFields.keys();
      break;
    case "organization":
      fields = organizationFields.keys();
      break;
  }

  return [...fields].map((field) => ({ title: field }));
}
