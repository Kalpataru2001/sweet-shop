const fs = require('fs');
const path = require('path');

// Define the paths
const dirPath = './src/environments';
const prodFilePath = './src/environments/environment.prod.ts';
const devFilePath = './src/environments/environment.ts'; // 👈 We need this one too!

// 1. Create the folder if it doesn't exist
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
}

// 2. Define the content (Use Production values for both in Netlify)
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${process.env.apiUrl || ""}',
  supabaseUrl: '${process.env.SUPABASE_URL}',
  supabaseKey: '${process.env.SUPABASE_KEY}'
};
`;

// 3. Write BOTH files
fs.writeFile(prodFilePath, envConfigFile, function (err) {
  if (err) {
    console.error('❌ Error creating prod environment file:', err);
    process.exit(1);
  } else {
    console.log(`✅ Prod Environment file generated at ${prodFilePath}`);
  }
});

fs.writeFile(devFilePath, envConfigFile, function (err) {
  if (err) {
    console.error('❌ Error creating dev environment file:', err);
    process.exit(1);
  } else {
    console.log(`✅ Base Environment file generated at ${devFilePath}`);
  }
});