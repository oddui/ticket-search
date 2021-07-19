# Ticket Search - Coding Challenge

## Requirements

- Search any fields on users, tickets, and organizations json files
- Search result should include associated documents
- Search for empty values
- For each query, time complexity should be better than O(N) for N documents

## Design choices

- Simple
- Efficient, use common data structures and algorithms for fast searching.
- Useful, make searches as useful as I can, e.g. the term "north korea" would match "A Catastrophe in Korea (North)".

## Search strategy

Looking at provided data, I categorized the fields into 5 types, each of which may have a different search strategy.

### ID

Example fields: _id, external_id, url...

These fields uniquely identify documents. Use hash maps to map IDs to the corresponding documents for quick look up. Search time complexity is O(1).

### Enum

Example fields: user.locale, user.role, ...

These fields have a static set of values. Use hash maps for quick lookup. Each enum value maps to a list of documents. Search time complexity is O(1).

### Boolean

Example fields: user.active, user.verified, ... Similar to enum, use hash maps for quick lookup.

### Timestamp

Example fields: created_at, and ticket.due_at

Searching by a specific timestamp is not so useful. People most likely want to search by a time range. I chose balanced binary search tree (`TreeMap`) to map timestamps to corresponding documents because it

- allows range based search (although the provide CLI does not support range based search, it can be easily extended to)
- efficient lookup using binary search

Search time complexity is O(lgN) for N documents.

### String

Example fields: user.name, user.alias, ...

I chose prefix tree (`TrieMap`) to map string fields to corresponding documents because it

- allows prefix based lookup
- compact memory usage
- lookup time is not relevant to the number of documents

Search time complexity is O(L) for query term length L.

## Object oriented design

The solution uses object oriented design. The main APIs are described below. There is a CLI client included in `src/index.ts`.

#### SearchIndex

A SearchIndex efficiently looks up documents by a field. There are 3 types of indexes. See search strategy above for details.

- HashIndex - for ID, enum, and booleans
- DateTimeBinarySearchIndex - for date times
- TrieIndex - for strings

#### Tokenizer

A Tokenizer is in charge of preparing the inputs for a search index.

- SpaceTokenizer

  It breaks strings into tokens by white space, converts tokens to lower case (case insensitive search), and removes some special characters.

#### EntitySearch

An EntitySearch loads documents and uses indexes and tokenizers to search loaded documents.

- UserSearch
- TicketSearch
- OrganizationSearch

## Dependency

Requires Node.js 16+. May also work on lower versions of Node.js, although not tested.

The solution tries to avoid tooling to focus on the problem. Direct npm dependencies are listed below and their usages are explained:

- typescript

  Compile TypeScript into JavaScript.

- standard-library-extension

  Useful data structure and algorithms, namely, `TreeMap`, and `TrieMap` are used in this solution. I initially created this library to practice algorithms but it turned out useful on many occasions. Please check it out at https://github.com/oddui/standard-library-extensions

- jest

  Run tests and generate coverage reports.

- prompts

  Interactive CLI helper.

To install dependencies

    npm install

## Usage

Build and start the included CLI. The data files are expected in the `/data` folder at the root of this repo.

```sh
# Build and start the CLI.
npm start
```

Or use individual build and run commands

```sh
# Build TypeScript into JavaScript.
npm run build

# Run the compiled JavaScript to start the CLI.
node dist/index.js
```

## Test

```sh
npm test
```

Coverage summary will be printed on screen and a coverage report generated in the `coverage` folder.
