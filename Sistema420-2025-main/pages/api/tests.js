import { PrismaClient } from '@prisma/client';

//Initializes Prisma Client for database operations.
const prisma = new PrismaClient();

// Utility to safely serialize BigInt values
function safeJson(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
  );
}

/**
 * Handles HTTP requests for retrieving test data based on various filters.
 * 
 * @param {Object} req - The request object, containing the following query parameters:
 * @param {string} req.query.id - Comma-separated list of test IDs to filter by. Optional.
 * @param {string} req.query.pn - Part number to filter by. Optional.
 * @param {string} req.query.application - Application identifier to filter by. Optional.
 * @param {string} req.query.plt - Unique Identification number of the production lot by. Optional.
 * @param {string} req.query.start_datetime1 - Timestamp marking the start of the testing process. Optional.
 * @param {string} req.query.start_datetime2 - Timestamp marking the end of the testing process. Optional.
 * @param {number} req.query.yield1 - Lower bound for yield filter. Optional.
 * @param {number} req.query.yield2 - Upper bound for yield filter. Optional.
 * @param {Object} res - The response object used to send back HTTP responses.
 * 
 * This function supports complex filtering based on IDs, part number, application, platform,
 * a datetime range, and yield range. It constructs a dynamic query for the Prisma Client based on provided
 * filters and includes related test specifications and ordered test results.
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {

      // Extract query parameters and parse ID list if provided
      const { filename, id, pn, application, plt, start_datetime1, start_datetime2, yield1, yield2 } = req.query;
      if (!filename && !pn && !application && !plt && !start_datetime1 && !start_datetime2 && !yield1 && !yield2 && !id) {
        return res.status(400).json({ error: 'At least one filter parameter is required.' });
      }

      const dateObject = new Date(start_datetime2);
      const dateUtc = dateObject.getUTCDate();
      dateObject.setUTCDate(dateUtc + 1);
      const updated_start_datetime2 = dateObject.toISOString().slice(0, 10);

      const filenameList = filename ? filename.split(',') : [];
      console.log(filenameList);
      // Construct dynamic query based on provided filters
      const query = {
        where: filenameList.length > 0 && filenameList[0] ? { filename: { in: filenameList } } : {
          AND: [
            pn ? { pn } : {},
            application ? { application } : {},
            plt ? { plt } : {},
            start_datetime1 || start_datetime2 ? { start_datetime: { ...(start_datetime1 ? { gte: new Date(start_datetime1) } : {}), ...(start_datetime2 ? { lte: new Date(updated_start_datetime2) } : {}) } } : {},
            yield1 || yield2 ? { yield: { ...(yield1 ? { gte: yield1 } : {}), ...(yield2 ? { lte: yield2 } : {}) } } : {}
          ].filter(Boolean)
        },
        include: {
          part_test_specifications: true,
          test_result: {
            orderBy: [
              { dut_no: 'asc' },
              { switch: 'asc' },
              { test_type: 'asc' }
            ],
          }
        },
      };
      console.log(query.where);
      // Execute query and return results
      let tests = await prisma.test.findMany(query);
      res.status(200).json(safeJson(tests))
    }
    catch (error) {
      // Handle errors and send error response
      console.error('Error fetching tests:', error);
      res.status(505).json({ error: 'Fetching Error' });
    }
  }
}