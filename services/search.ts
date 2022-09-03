// For the search only version
import algoliasearch from "algoliasearch/lite";
import { log } from "../log";

const APP_ID: string =  process.env.APP_ID || '';
const API_KEY: string = process.env.API_KEY || '';
const INDEX_NAME: string = "prod_comics";

const client = algoliasearch(APP_ID, API_KEY);
const index = client.initIndex(INDEX_NAME);

const CACHE: any = {};

export const search = async ({ query }: { query: string }) => {
  if (CACHE[query]) {
    // log(`Searching in CACHE: ${query}`);
    return { results: CACHE[query] }
  };

  // log(`Searching in algolia queries: ${query}`);
  const { hits } = await index.search(query, {
    attributesToRetrieve: ["id", "title", "img", "alt"],
    hitsPerPage: 10,
  });

  CACHE[query] = hits;

  return { results: hits };
};
