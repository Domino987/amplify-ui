const glob = require('glob');
const fs = require('fs-extra');
const { pascalCase } = require('change-case');

const dirPath = `../react/src/primitives/Icon/icons/`; // build to @aws-amplify/ui-react package
const iconSetPath = '../../material-design-icons/svg/**/materialicons/*.svg';
const iconNames = [];
// Material icon set has 2 icons(addchart and add_chart) that only differ in casing
// Pick one to filter out afterwards
const iconFilter = ['IconAddchart'];

glob(iconSetPath, function (error, files) {
  if (error) {
    throw error;
  }
  files.forEach((filePath) => {
    const iconName = `Icon${pascalCase(filePath.split('/')[5])}`;
    const source = fs.readFileSync(filePath, { encoding: 'utf8' });
    const outputPath = `${dirPath}${iconName}.tsx`;

    // apparently there are some duplicates and we start with the plain ones
    if (iconFilter.includes(iconName) || iconNames.includes(iconName)) {
      return;
    }

    const reactIconComponent = `import React from 'react';
export const ${iconName} = (props) => {
	const {
		size = "medium",
		fill = "currentColor",
		ariaLabel,
		...rest
	} = props;
	return (
		${source
      .replace('class="st0"', '')
      .replace(/style="fill:none"/g, '')
      .replace('<path d="M0 0h24v24H0z" fill="none"/>', '')
      .replace('width="24"', `className="amplify-ui-icon"`)
      .replace(
        'height="24"',
        'data-size={size} aria-label={ariaLabel} fill={fill} {...rest}'
      )}
	);
};`;
    fs.ensureDirSync(dirPath);
    fs.writeFileSync(outputPath, reactIconComponent);
    iconNames.push(iconName);
  });

  const iconExportsFile = iconNames
    .map((iconName) => {
      return `export * from './${iconName}';`;
    })
    .join(`\n`);
  fs.ensureDirSync(dirPath);
  fs.writeFileSync(`${dirPath}index.ts`, iconExportsFile);
});
