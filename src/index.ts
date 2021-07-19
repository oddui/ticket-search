import path from "path";
import prompts, { PromptObject } from "prompts";
import { assertIsKnownEntity } from "./entity";
import { organizationFields } from "./entity-search/organization-search";
import { ticketFields } from "./entity-search/ticket-search";
import { userFields } from "./entity-search/user-search";
import Search, { SearchResult } from "./search";

(async () => {
  console.info("Starting ticket search...\n");
  const search = new Search();

  try {
    await search.readDataFiles(path.resolve(__dirname, "..", "data"));
  } catch (e) {
    console.info(`- ${e.message}`);
    console.info(
      `- Please place users.json, tickets.json, and organizations.json in the data folder.`
    );
    process.exit(1);
  }

  console.info(`- ${highlight("Welcome to ticket search")}`);
  console.info(`- ${highlight("To exit, press Ctrl+C")}\n`);
  nextCommand();

  async function nextCommand() {
    const { entity, field, term } = await prompts(questions(), {
      onCancel: () => {
        console.info("- Bye");
        process.exit();
      },
    });

    try {
      const results = search.search(entity, field, term);
      console.info();
      for (const result of results) {
        printSearchResult(result);
        console.info();
      }
      // Pluralize result(s)
      switch (results.length) {
        case 0:
          console.info(`- no results\n`);
          break;
        case 1:
          console.info(`- ${highlight("1 result", "1")}\n`);
          break;
        default:
          console.info(
            `- ${highlight(`${results.length} results`, `${results.length}`)}\n`
          );
      }
    } catch (e) {
      console.info(`- Failed to search. Reason: ${e.message}`);
    }

    process.nextTick(nextCommand);
  }
})();

function questions(): PromptObject[] {
  return [
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
}

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

function printSearchResult(result: SearchResult) {
  for (const [field, value] of Object.entries(result)) {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        console.info(`${field}_${i}`.padEnd(20), String(value[i]));
      }
    } else {
      console.info(field.padEnd(20), String(value));
    }
  }
}

/**
 * Highlight part of text. The returned string should be used in console log methods.
 * @param text
 * @param part
 * @returns
 */
function highlight(text: string, part?: string) {
  if (part) {
    return text.replace(part, `\x1b[36m$&\x1b[0m`);
  } else {
    return `\x1b[36m${text}\x1b[0m`;
  }
}
