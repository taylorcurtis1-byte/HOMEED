import * as fs from 'fs';
import * as path from 'path';

const dir = './src';
const replaceRules = [
  { regex: /bg-\[#606C51\]/g, replacement: 'bg-[#1A1A1A]' },
  { regex: /text-\[#606C51\]/g, replacement: 'text-[#1A1A1A]' },
  { regex: /accent-\[#606C51\]/g, replacement: 'accent-[#1A1A1A]' },
  { regex: /border-\[#606C51\]/g, replacement: 'border-[#1A1A1A]' },
  { regex: /hover:bg-\[#4A543F\]/g, replacement: 'hover:bg-black' },
  { regex: /hover:text-\[#606C51\]/g, replacement: 'hover:text-[#1A1A1A]' },
  
  { regex: /bg-\[#FAF8F5\]/g, replacement: 'bg-transparent' },
  { regex: /bg-\[#F7F4EF\]/g, replacement: 'bg-[#F5F4F0]' },
  { regex: /text-\[#2E2A25\]/g, replacement: 'text-[#1A1A1A]' },
  { regex: /text-\[#4A443C\]/g, replacement: 'text-[#1A1A1A]/80' },
  { regex: /bg-\[#2E2A25\]/g, replacement: 'bg-[#1A1A1A]' },
  
  { regex: /text-\[#D46A43\]/g, replacement: 'text-[#1A1A1A]/60' },
  { regex: /text-\[#E5B23E\]/g, replacement: 'text-[#1A1A1A]/60' },
  { regex: /border-\[#D46A43\]/g, replacement: 'border-[#1A1A1A]/60' },
  { regex: /border-\[#C4B79B\]/g, replacement: 'border-[#1A1A1A]/40' },
  { regex: /border-\[#E5B23E\]/g, replacement: 'border-[#1A1A1A]/20' },
  
  { regex: /border-\[#E6DFD3\]/g, replacement: 'border-[#1A1A1A]/20' },
  { regex: /border-gray-100/g, replacement: 'border-[#1A1A1A]/10' },
  { regex: /bg-gray-100/g, replacement: 'bg-[#1A1A1A]/10' },
  { regex: /bg-gray-50/g, replacement: 'bg-[#1A1A1A]/5' },
  { regex: /border-gray-200/g, replacement: 'border-[#1A1A1A]/20' },
  { regex: /text-gray-300/g, replacement: 'text-[#1A1A1A]/30' },
  { regex: /text-gray-400/g, replacement: 'text-[#1A1A1A]/40' },
  { regex: /text-gray-500/g, replacement: 'text-[#1A1A1A]/70' },
  { regex: /text-gray-600/g, replacement: 'text-[#1A1A1A]/80' },
  { regex: /text-gray-700/g, replacement: 'text-[#1A1A1A]/90' },
  
  { regex: /rounded-t-\[100px\]/g, replacement: 'rounded-none' },
  { regex: /rounded-\[14px\]/g, replacement: 'rounded-none' },
  { regex: /rounded-xl/g, replacement: 'rounded-none' },
  { regex: /rounded-lg/g, replacement: 'rounded-none' },
  { regex: /rounded-2xl/g, replacement: 'rounded-none' },
  { regex: /rounded-full/g, replacement: 'rounded-none' },
  { regex: /rounded/g, replacement: 'rounded-none' },
  
  { regex: /shadow-\[0_2px_4px_rgba\(40,30,20,0\.01\)\]/g, replacement: 'shadow-none' },
  { regex: /shadow-sm/g, replacement: 'shadow-none' },
  { regex: /shadow-xl/g, replacement: 'shadow-none' },
  { regex: /shadow-inner/g, replacement: 'shadow-none' },
  
  // Fix specifically the App and modals so they aren't completely transparent
  { regex: /bg-white/g, replacement: 'bg-[#F5F4F0]' },
  
  { regex: /text-sm/g, replacement: 'text-xs' },
  
  // Custom fixes for Recharts logic
  { regex: /const COLORS = \['#E6DFD3', '#E5B23E', '#606C51', '#D46A43'\];/g, replacement: "const COLORS = ['#DCD9D1', '#A6A49F', '#1A1A1A', '#666666'];" },
  { regex: /fill="#606C51"/g, replacement: 'fill="#1A1A1A"' },
  { regex: /fill="#E5B23E"/g, replacement: 'fill="#A6A49F"' },
  { regex: /fill="#D46A43"/g, replacement: 'fill="#666666"' },
  { regex: /fill="#FAF8F5"/g, replacement: 'fill="#DCD9D1"' },
  { regex: /stroke="#E6DFD3"/g, replacement: 'stroke="rgba(26,26,26,0.1)"' },
  { regex: /border: '1px solid #E6DFD3'/g, replacement: "border: '1px solid rgba(26,26,26,0.2)', borderRadius: '0', backgroundColor: '#F5F4F0'" }
];

function walk(directory: string) {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      replaceRules.forEach(rule => {
        content = content.replace(rule.regex, rule.replacement);
      });
      fs.writeFileSync(fullPath, content);
    }
  });
}

walk(dir);
console.log('Styles updated.');
