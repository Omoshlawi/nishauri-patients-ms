import { Types } from "mongoose";

function simpleDbQueryParser(query: any, skip: string[] = []) {
  const parsedQuery: any = {};

  for (const key in query) {
    const value = query[key];
    if (value === "true" || value === "false") {
      if (skip.includes(key)) parsedQuery[key] = value;
      else parsedQuery[key] = value === "true";
    } else if (!isNaN(value)) {
      if (skip.includes(key)) parsedQuery[key] = value;
      else parsedQuery[key] = parseFloat(value);
    } else if (Types.ObjectId.isValid(value)) {
      if (skip.includes(key)) parsedQuery[key] = value;
      else parsedQuery[key] = new Types.ObjectId(value);
    } else {
      parsedQuery[key] = value;
    }
  }

  return parsedQuery;
}

const simpleFilter = (
  query: any,
  filterFields: string[] = [],
  skipParse: string[] = [],
  operator = "$and"
) => {
  const q = simpleDbQueryParser(query, skipParse);
  const f = filterFields
    .filter((key) => q[key])
    .map((key) => ({ [key]: q[key] }));
  return {
    $match: f.length > 0 ? { [operator]: f } : {},
  };
};

const simpleSearch = (
  searchValue: any,
  searchFields: string[] = [],
  skipParse: string[] = []
) => {
  const query = searchFields.reduce(
    (accumulated, current) => ({
      ...accumulated,
      [current]: searchValue,
    }),
    {}
  );
  return simpleFilter(query, searchFields, skipParse, "$or");
};

export default {
  simpleDbQueryParser,
  simpleFilter,
  simpleSearch,
};
