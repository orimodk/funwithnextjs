const iconv = require('iconv-lite'); // For explicit encoding (optional)
const encoding = require('encoding'); // For alternative library (optional)

import { NextApiRequest, NextApiResponse } from 'next';
import { parseString } from 'xml2js';
import { writeFileSync } from 'fs';

type ParsedXml = { [key: string]: any };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const urls = [
    "https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=23562&bannerid=94836&feedid=2569", // 01 Møbelkompagniet
    "https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=23562&bannerid=57775&feedid=1046", // 02 Roligan
  ]; // Replace with your actual URLs

  try {
    // Initialize mergedData outside the loop
    let mergedData: { [key: string]: any } = {};

    for (const url of urls) {
      const response = await fetch(url);
      const xmlData = await response.text();

      // Specify the encoding in the parseString call
      parseString(xmlData, { encoding: 'ISO-8859-1' }, (err: Error | null, result: ParsedXml) => {
        if (err) throw err;
        // Add each product to the mergedData.produkter.produkt array
        mergedData.produkter = {
          produkt: [...(mergedData.produkter?.produkt || []), ...result.produkter.produkt],
        };
      });
    }

    // Check if product array is empty
    if (!mergedData.produkter.produkt.length) {
      res.status(404).json({ message: 'No products found' });
      return;
    }

    // No JSON encoding needed since data is already ISO-8859-1
    const jsonContent = JSON.stringify(mergedData, null, 2);

    // **Choose one of the following encoding approaches:**

    // **1. Explicit encoding with iconv-lite (optional):**
    // const encodedContent = iconv.encode(jsonContent, 'ISO-8859-1', 'utf-8');
    // writeFileSync('src/app/data/merged-data.json', encodedContent);

    // **2. Alternative library (encoding):**
    // const convertedContent = encoding.convert(jsonContent, 'ISO-8859-1', 'utf-8');
    // writeFileSync('src/app/data/merged-data.json', convertedContent);

    // **3. No additional encoding (if confident of consistent ISO-8859-1):**
    //writeFileSync('src/app/data/merged-data.json', jsonContent);

    res.status(200).json({ message: 'XML data merged successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to merge XML data' });
  }
}
