const fs = require('fs');

// Path where the file should be created
const targetPath = './src/environments/environment.prod.ts';

// The content of the file
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${process.env.apiUrl || ""}',
  supabaseUrl: '${process.env.SUPABASE_URL}',
  supabaseKey: '${process.env.SUPABASE_KEY}'
};
`;

// Write the file
fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`Output generated at ${targetPath}`);
  }
});