const fs = require('fs');
const path = require('path');

// Define the path
const dirPath = './src/environments';
const filePath = './src/environments/environment.prod.ts';

// 1. Create the folder if it doesn't exist (CRITICAL STEP)
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
}

// 2. Define the content
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${process.env.apiUrl || ""}',
  supabaseUrl: '${process.env.SUPABASE_URL}',
  supabaseKey: '${process.env.SUPABASE_KEY}'
};
`;

// 3. Write the file
fs.writeFile(filePath, envConfigFile, function (err) {
  if (err) {
    console.error('❌ Error creating environment file:', err);
    process.exit(1); // Fail the build if we can't write
  } else {
    console.log(`✅ Environment file generated at ${filePath}`);
  }
});