import fs, { promises as fsPromises } from 'fs';
import path from 'path';
import https from 'https';
import { promisify } from 'util';
import xml2js from 'xml2js';
import { redirect } from '../../../node_modules/next/navigation';


const downloadFile = promisify((url, dest, callback) => {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(callback);
    });
  }).on('error', (error) => {
    fs.unlink(dest);
    if (callback) callback(error.message);
  });
});

const parseXML = promisify(xml2js.parseString);

type Product = Record<string, unknown>;

async function mergeXMLFiles(req: NextApiRequest, res: NextApiResponse) {
  const urls = [
    "https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=23562&bannerid=94836&feedid=2569", // 01 Møbelkompagniet
    "https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=23562&bannerid=57775&feedid=1046", // 02 Roligan
    "https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=23562&bannerid=45583&feedid=613", // 03 Coop
    "https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=23562&bannerid=107557&feedid=3406" // 04 Kitchen Gadget
  ];

  const folderPath = path.join(process.cwd(), 'src/app/data/xml');
  const jsonFilePath = path.join(process.cwd(), 'src/app/data/merged.json');

  try {
    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      await fsPromises.mkdir(folderPath);
    }

    // Download and parse each XML file
    const xmlData = await Promise.all(
      urls.map(async (url, i) => {
        const fileName = `file${i + 1}.xml`;
        const filePath = path.join(folderPath, fileName);
        await downloadFile(url, filePath);
        console.log(`Downloaded ${fileName} to ${folderPath}`);

        const xmlContent = await fsPromises.readFile(filePath, 'binary');
        const jsonData = await parseXML(xmlContent);
        return jsonData;
      })
    );

    // Merge the JSON data into a single object
    const mergedData: Record<string, Product[]> = {};
    for (const xmlObject of xmlData) {
      const key = Object.keys(xmlObject)[0];
      const newData = Array.isArray(xmlObject[key]) ? xmlObject[key] : [xmlObject[key]];

      if (key === 'produkter') {
        // Extract all "produkt" arrays and merge them into a single array
        const produktArrays = newData.map((item) => item.produkt);
        const produkter = [].concat(...produktArrays);
        mergedData[key] = mergedData[key] ? mergedData[key].concat(produkter) : produkter;
      } else {
        mergedData[key] = [...(mergedData[key] || []), ...newData];
      }
    }

    // Save the merged data as JSON to a file
    await fsPromises.writeFile(jsonFilePath, JSON.stringify(mergedData));
    console.log(`Merged data saved to ${jsonFilePath}`);

    res.status(200).json({ message: 'XML files merged and saved successfully' });
  } catch (error) {
    redirect(`/`)
  }
}

export default mergeXMLFiles;
