import jetpack from 'fs-jetpack';

export const readConfigFile = (asObj: boolean = false): any => {
  const filePath = `${jetpack.cwd()}/config.json`;
  const configString = jetpack.read(filePath);
  if (asObj) {
    return configString ? JSON.parse(configString) : {};
  } else {
    return configString;
  }
};

export const writeConfigFile = (configJson: object): void => {
  const filePath = `${jetpack.cwd()}/config.json`;
  jetpack.write(filePath, configJson);
};

export const updateConfigFile = (key: string, value: any): void => {
  const filePath = `${jetpack.cwd()}/config.json`;
  const configString = jetpack.read(filePath);
  let configJson = configString ? JSON.parse(configString) : {};
  value ? (configJson[key] = value) : delete configJson[key];
  jetpack.write(filePath, configJson);
};
